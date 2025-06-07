import { useMutation } from '@affine/admin/use-mutation';
import { useQuery } from '@affine/admin/use-query';
import { notify } from '@affine/component';
import { useAsyncCallback } from '@affine/core/components/hooks/affine-async-hooks';
import { UserFriendlyError } from '@affine/error';
import {
  appConfigQuery,
  type UpdateAppConfigInput,
  updateAppConfigMutation,
} from '@affine/graphql';
import { cloneDeep, get, merge, set } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useState } from 'react'; // Added React import

import type { AppConfig } from './config';

export { type UpdateAppConfigInput };

export type AppConfigUpdates = Record<string, { from: any; to: any }>;

export const useAppConfig = () => {
  const { data: queryData, mutate } = useQuery({
    query: appConfigQuery,
  });

  // Adapt to potential API response structures for appConfig
  const appConfig = useMemo<AppConfig | null>(() => {
    if (!queryData) return null;
    // If queryData.appConfig exists, use it; otherwise, assume queryData itself is the appConfig.
    return queryData.appConfig || queryData;
  }, [queryData]);

  const { trigger: saveUpdates } = useMutation({
    mutation: updateAppConfigMutation,
  });

  const [updates, setUpdates] = useState<AppConfigUpdates>({});
  const [patchedAppConfig, setPatchedAppConfig] = useState<AppConfig | null>(null);

  // Effect to update patchedAppConfig when appConfig loads or changes
  useEffect(() => {
    if (appConfig) {
      setPatchedAppConfig(cloneDeep(appConfig));
    } else {
      setPatchedAppConfig(null); // Explicitly set to null if appConfig is null
    }
  }, [appConfig]);

  const save = useAsyncCallback(async () => {
    const updateInputs: UpdateAppConfigInput[] = Object.entries(updates).map(
      ([key, value]) => {
        const splitIndex = key.indexOf('.');
        const module = key.slice(0, splitIndex);
        const field = key.slice(splitIndex + 1);

        return {
          module,
          key: field,
          value: value.to,
        };
      }
    );

    try {
      const mutationResponse = await saveUpdates({
        updates: updateInputs,
      });

      // The updated gqlFetcher returns { data: result.data } or { data: result }.
      // mutationResponse is the direct output of gqlFetcher.
      const newAppConfig = mutationResponse?.data || mutationResponse;

      if (newAppConfig) {
        // Update SWR cache.
        // We need to provide the new state for `queryData` to the mutate function.
        if (queryData && queryData.appConfig !== undefined && newAppConfig.appConfig === undefined) {
          // Original structure was { appConfig: ... }, new data is direct config
          // This case implies the new API for update returns the config directly,
          // while the query API might return it nested.
          // Or, newAppConfig is actually { appConfig: ... } if API is consistent.
          // For safety, we check if queryData.appConfig was the source.
          await mutate(prevQueryData => ({ ...prevQueryData, appConfig: newAppConfig }), { revalidate: false });
        } else {
          // Original structure was direct, or new structure matches old.
          await mutate(newAppConfig, { revalidate: false });
        }
      } else {
        // If mutation didn't return the new config, revalidate from server.
        await mutate();
      }

      setUpdates({});
      notify.success({
        title: 'Saved',
        message: 'Settings have been saved successfully.',
      });
    } catch (e) {
      const error = UserFriendlyError.fromAny(e);
      notify.error({
        title: 'Failed to save',
        message: error.message,
      });
      console.error(e);
    }
  }, [updates, mutate, saveUpdates, queryData]); // queryData is a dependency for cache update logic

  const update = useCallback(
    (path: string, value: any) => {
      if (!appConfig) return; // Guard against appConfig being null when update is called

      const [module, field, subField] = path.split('/');
      const key = `${module}.${field}`;
      const currentVal = get(appConfig, key); // Use appConfig for "from" value

      setUpdates(prev => {
        const to = subField
          ? set(cloneDeep(prev[key]?.to ?? currentVal), subField, value) // cloneDeep to avoid mutating previous `to` state
          : value;

        return {
          ...prev,
          [key]: {
            from: currentVal, // Ensure 'from' is from the stable appConfig
            to,
          },
        };
      });

      setPatchedAppConfig(prevPatchedAppConfig => {
        if (!prevPatchedAppConfig) return null;
        const newPatched = cloneDeep(prevPatchedAppConfig);
        return set(
          newPatched,
          `${module}.${field}${subField ? `.${subField}` : ''}`,
          value
        );
      });
    },
    [appConfig] // appConfig is a dependency
  );

  return {
    // Consumers might expect appConfig to be non-null if the hook is used after loading.
    // However, it can be null during initialization. Casting as AppConfig implies a contract.
    appConfig: appConfig as AppConfig,
    patchedAppConfig,
    update,
    save,
    updates,
  };
};
