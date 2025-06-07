// useMutation import removed
import { notify } from '@affine/component';
import { useAsyncCallback } from '@affine/core/components/hooks/affine-async-hooks';
import { UserFriendlyError } from '@affine/error';
import {
  type UpdateAppConfigInput,
  // updateAppConfigMutation removed
} from '@affine/graphql';
import { cloneDeep, get, set } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation'; // Imported useSWRMutation

import type { AppConfig } from './config';

export { type UpdateAppConfigInput };

export type AppConfigUpdates = Record<string, { from: any; to: any }>;

// TODO: Proper token management will be addressed globally later.
const authToken = 'YOUR_JWT_TOKEN_HERE';
const APP_CONFIG_API_URL = '/v1/admin/app-config';

interface AppConfigResponseWrapper { // For both fetch and update to expect { data: AppConfig }
  data: AppConfig;
}

const fetchAppConfig = async (url: string): Promise<AppConfig> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch app config:', errorText);
    throw new Error(`Failed to fetch app config: ${response.statusText}`);
  }

  const result: AppConfigResponseWrapper = await response.json();
  return result.data;
};

// Fetcher for updating app config
async function restfulUpdateAppConfig(
  url: string,
  { arg }: { arg: { updates: UpdateAppConfigInput[] } }
): Promise<AppConfig> { // Returns the updated app config
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ updates: arg.updates }), // Backend expects { "updates": [...] }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to update app config:', errorText);
    throw new Error(`Failed to update app config: ${response.statusText} - ${errorText}`);
  }
  const result: AppConfigResponseWrapper = await response.json(); // Expects { data: AppConfig }
  return result.data;
}

export const useAppConfig = () => {
  const {
    data: appConfig,
    error: fetchError,
    isLoading: isLoadingConfig
  } = useSWR<AppConfig>(APP_CONFIG_API_URL, fetchAppConfig);

  const { mutate: revalidateSWRCache } = useSWRConfig();

  const {
    trigger: triggerSaveUpdates,
    isMutating: isSavingConfig,
    error: saveConfigError
  } = useSWRMutation(
    APP_CONFIG_API_URL,
    restfulUpdateAppConfig
  );

  const [updates, setUpdates] = useState<AppConfigUpdates>({});
  const [patchedAppConfig, setPatchedAppConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    if (appConfig) {
      setPatchedAppConfig(cloneDeep(appConfig));
    } else {
      setPatchedAppConfig(null);
    }
  }, [appConfig]);

  const save = useAsyncCallback(async () => {
    const updateInputs: UpdateAppConfigInput[] = Object.entries(updates).map(
      ([key, value]) => {
        const splitIndex = key.indexOf('.');
        const module = key.slice(0, splitIndex);
        const field = key.slice(splitIndex + 1);
        return { module, key: field, value: value.to };
      }
    );

    try {
      const newAppConfigData = await triggerSaveUpdates({
        updates: updateInputs,
      });

      if (newAppConfigData) {
        // Optimistically update SWR cache with the new config returned by the mutation.
        await revalidateSWRCache(APP_CONFIG_API_URL, newAppConfigData, { revalidate: false });
        setPatchedAppConfig(cloneDeep(newAppConfigData));
      } else {
        // If mutation didn't return data (should not happen if API is consistent), revalidate from server.
        await revalidateSWRCache(APP_CONFIG_API_URL);
      }

      setUpdates({});
      notify.success({
        title: 'Saved',
        message: 'Settings have been saved successfully.',
      });
    } catch (e) {
      const error = UserFriendlyError.fromAny(saveConfigError || e);
      notify.error({
        title: 'Failed to save',
        message: error.message,
      });
      console.error("Save app config error:", saveConfigError || e);
    }
  }, [updates, revalidateSWRCache, triggerSaveUpdates, saveConfigError]);

  const update = useCallback(
    (path: string, value: any) => {
      if (!appConfig) return;

      const [module, field, subField] = path.split('/');
      const key = `${module}.${field}`;
      const currentVal = get(appConfig, key);

      setUpdates(prev => {
        const to = subField
          ? set(cloneDeep(prev[key]?.to ?? currentVal), subField, value)
          : value;
        return { ...prev, [key]: { from: currentVal, to } };
      });

      setPatchedAppConfig(prevPatchedAppConfig => {
        if (!prevPatchedAppConfig) return null;
        const newPatched = cloneDeep(prevPatchedAppConfig);
        return set(newPatched, `${module}.${field}${subField ? `.${subField}` : ''}`, value);
      });
    },
    [appConfig]
  );

  if (isLoadingConfig) {
    return {
      appConfig: null,
      patchedAppConfig: null,
      update,
      save,
      updates,
      isLoading: true,
      isSaving: false,
      error: null,
      saveError: null,
    };
  }

  if (fetchError) {
    console.error('Error fetching app config:', fetchError);
    return {
      appConfig: null,
      patchedAppConfig: null,
      update,
      save,
      updates,
      isLoading: false,
      isSaving: false,
      error: fetchError,
      saveError: null,
    };
  }

  return {
    appConfig: appConfig as AppConfig,
    patchedAppConfig,
    update,
    save,
    updates,
    isLoading: false,
    isSaving: isSavingConfig,
    error: null, // No fetch error at this point
    saveError: saveConfigError,
  };
};
