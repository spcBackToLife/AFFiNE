import type { GetCurrentUserFeaturesQuery, ServerConfig } from '@affine/graphql';
import {
  FeatureType,
  // getCurrentUserFeaturesQuery removed
} from '@affine/graphql';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

// useMutateQueryResource and useQuery removed as they are no longer used for GQL in this file.

// TODO: Proper token management will be addressed globally later.
const authToken = 'YOUR_JWT_TOKEN_HERE';
const APP_CONFIG_API_URL = '/v1/admin/app-config';
const CURRENT_USER_API_URL = '/v1/protected/me';

interface AppConfigResponse {
  serverConfig: ServerConfig;
  [key: string]: any;
}

// This type represents the structure of the "user" object in the GetMe response
type CurrentUser = NonNullable<GetCurrentUserFeaturesQuery['currentUser']>;

interface FetchCurrentUserResponse {
  message: string;
  user: CurrentUser;
}

const fetchFullAppConfig = async (url: string): Promise<AppConfigResponse> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch app/server config:', errorText);
    throw new Error(`Failed to fetch app/server config: ${response.statusText}`);
  }
  const result: { data: AppConfigResponse } = await response.json();
  return result.data;
};

export const useServerConfig = () => {
  const { data, error, isLoading } = useSWR<AppConfigResponse>(
    APP_CONFIG_API_URL,
    fetchFullAppConfig
  );

  if (isLoading) {
    return undefined;
  }
  if (error) {
    console.error('Error fetching server config:', error);
    return undefined;
  }
  return data?.serverConfig;
};

export const useRevalidateServerConfig = () => {
  const { mutate } = useSWRConfig();
  return () => {
    return mutate(APP_CONFIG_API_URL);
  };
};

const fetchCurrentUser = async (url: string): Promise<CurrentUser> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch current user:', errorText);
    // Consider how errors should be propagated to useSWR
    throw new Error(`Failed to fetch current user: ${response.statusText}`);
  }
  const result: FetchCurrentUserResponse = await response.json();
  return result.user; // Return the user object directly
};

export const useRevalidateCurrentUser = () => {
  const { mutate } = useSWRConfig();
  return () => {
    return mutate(CURRENT_USER_API_URL);
  };
};

export const useCurrentUser = () => {
  const { data: currentUser, error, isLoading } = useSWR<CurrentUser>(
    CURRENT_USER_API_URL,
    fetchCurrentUser
  );

  if (isLoading) {
    return undefined; // Or null, or a specific loading state object
  }
  if (error) {
    console.error('Error fetching current user:', error);
    return undefined; // Or null
  }
  // The old hook returned data.currentUser.
  // The new fetchCurrentUser returns the user object directly, so SWR's data is the user.
  return currentUser;
};

export function isAdmin(user: CurrentUser) { // Updated type to CurrentUser
  return user.features.includes(FeatureType.Admin);
}

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setValue(result.matches);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
}
