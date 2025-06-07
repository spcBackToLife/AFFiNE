import { useAsyncCallback } from '@affine/core/components/hooks/affine-async-hooks';
// GraphQL imports are managed based on usage by other hooks in this file.
import {
  // importUsersMutation, // Will be removed by this change
  // listUsersQuery, // Potentially removed if not used by other GQL hooks
  useMutateQueryResource, // May become unused if all GQL mutations in file are refactored
  useMutation, // May become unused
  type ImportUsersInput, // Keep type if used by REST version
  type ImportUsersMutation, // Keep type if used by REST version (UserImportReturnType)
} from '@affine/graphql';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

import type { UserInput, UserType } from '../schema';

// TODO: Proper token management will be addressed globally later.
const authToken = 'YOUR_JWT_TOKEN_HERE';
const ADMIN_USERS_API_URL = '/v1/admin/users/';
const ADMIN_USERS_IMPORT_API_URL = '/v1/admin/users/import';


// Types for REST API responses
interface CreateUserResponseData {
  id: string;
}
interface CreateUserResponse {
  data: CreateUserResponseData;
}

interface UpdateUserResponseData {
  id: string;
  name: string;
  email: string;
}
interface UpdateUserResponse {
  data: UpdateUserResponseData;
}

interface CreateChangePasswordUrlResponse {
  data: string;
}

interface DeleteUserResponse {
  data: {
    success: boolean;
  };
}

interface EnableUserResponseData {
  email: string;
  disabled: boolean;
}
interface EnableUserResponse {
  data: EnableUserResponseData;
}

interface DisableUserResponseData {
  email: string;
  disabled: boolean;
}
interface DisableUserResponse {
  data: DisableUserResponseData;
}

// Matches UserImportReturnType which is ImportUsersMutation['importUsers']
type ImportUsersRESTResponseData = ImportUsersMutation['importUsers'];
interface ImportUsersRESTResponse {
  data: ImportUsersRESTResponseData;
}


// Fetcher for creating a user
async function restfulCreateUser(
  url: string,
  { arg }: { arg: Pick<UserInput, 'name' | 'email' | 'password'> }
): Promise<CreateUserResponseData> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      input: {
        name: arg.name,
        email: arg.email,
        password: arg.password === '' ? undefined : arg.password,
      },
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to create user:', errorText);
    throw new Error(`Failed to create user: ${response.statusText} - ${errorText}`);
  }
  const result: CreateUserResponse = await response.json();
  return result.data;
}

// Fetcher for updating user features
async function restfulUpdateUserFeatures(
  url: string,
  { arg }: { arg: { userId: string; features: string[] } }
): Promise<void> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      features: arg.features,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to update user features:', errorText);
    throw new Error(`Failed to update user features: ${response.statusText} - ${errorText}`);
  }
  await response.json();
}

// Fetcher for updating user's basic details (name, email)
async function restfulUpdateUser(
  url: string,
  { arg }: { arg: { userId: string; name?: string; email?: string } }
): Promise<UpdateUserResponseData> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      input: {
        name: arg.name,
        email: arg.email,
      },
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to update user details:', errorText);
    throw new Error(`Failed to update user details: ${response.statusText} - ${errorText}`);
  }
  const result: UpdateUserResponse = await response.json();
  return result.data;
}

// Fetcher for creating a change password URL
async function restfulCreateChangePasswordUrl(
  url: string,
  { arg }: { arg: { userId: string; callbackUrl: string } }
): Promise<string> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      callbackUrl: arg.callbackUrl,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to create change password URL:', errorText);
    throw new Error(`Failed to create change password URL: ${response.statusText} - ${errorText}`);
  }
  const result: CreateChangePasswordUrlResponse = await response.json();
  return result.data;
}

// Fetcher for deleting a user
async function restfulDeleteUser(
  url: string,
  { arg }: { arg: { userId: string } }
): Promise<boolean> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to delete user:', errorText);
    throw new Error(`Failed to delete user: ${response.statusText} - ${errorText}`);
  }
  const result: DeleteUserResponse = await response.json();
  if (!result.data.success) {
    throw new Error('Deletion reported as unsuccessful by the API.');
  }
  return result.data.success;
}

// Fetcher for enabling a user
async function restfulEnableUser(
  url: string,
  { arg }: { arg: { userId: string } }
): Promise<EnableUserResponseData> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to enable user:', errorText);
    throw new Error(`Failed to enable user: ${response.statusText} - ${errorText}`);
  }
  const result: EnableUserResponse = await response.json();
  return result.data;
}

// Fetcher for disabling a user
async function restfulDisableUser(
  url: string,
  { arg }: { arg: { userId: string } }
): Promise<DisableUserResponseData> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to disable user:', errorText);
    throw new Error(`Failed to disable user: ${response.statusText} - ${errorText}`);
  }
  const result: DisableUserResponse = await response.json();
  return result.data;
}

// Fetcher for importing users
async function restfulImportUsers(
  url: string, // Will be /v1/admin/users/import
  { arg }: { arg: { input: ImportUsersInput } }
): Promise<ImportUsersRESTResponseData> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      // The controller expects { "users": [...] }, which matches ImportUsersInput structure.
      // So, we can pass arg.input directly if it's { users: [...] }
      // Or, if arg.input is the array itself, then { users: arg.input }
      // Assuming arg.input is { users: [...] } as per GQL ImportUsersInput type
      users: arg.input.users,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to import users:', errorText);
    throw new Error(`Failed to import users: ${response.statusText} - ${errorText}`);
  }
  const result: ImportUsersRESTResponse = await response.json();
  return result.data; // Returns the array of results
}


export interface ExportField {
  id: string;
  label: string;
  checked: boolean;
}

export type UserImportReturnType = ImportUsersMutation['importUsers'];

export const useCreateUser = () => {
  const { mutate: revalidateUserList } = useSWRConfig();

  const {
    trigger: triggerCreateUser,
    isMutating: creatingUser,
    error: createUserError,
  } = useSWRMutation(ADMIN_USERS_API_URL, restfulCreateUser);

  const {
    trigger: triggerUpdateFeaturesForCreate,
    isMutating: updatingFeaturesForCreate,
    error: updateFeaturesErrorForCreate,
  } = useSWRMutation(
    (userId: string) => `${ADMIN_USERS_API_URL}${userId}/features`,
    restfulUpdateUserFeatures
  );

  const create = useAsyncCallback(
    async ({ name, email, password, features }: UserInput) => {
      try {
        const createdAccount = await triggerCreateUser({ name, email, password });
        if (!createdAccount || !createdAccount.id) {
          throw new Error('User creation did not return a valid ID.');
        }
        await triggerUpdateFeaturesForCreate({ userId: createdAccount.id, features });
        await revalidateUserList(ADMIN_USERS_API_URL);
        toast.success('Account created and features updated successfully');
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        toast.error(`Failed to create account: ${message}`);
        console.error("Create user full error:", e, createUserError, updateFeaturesErrorForCreate);
      }
    },
    [triggerCreateUser, triggerUpdateFeaturesForCreate, revalidateUserList, createUserError, updateFeaturesErrorForCreate]
  );

  const isMutating = creatingUser || updatingFeaturesForCreate;
  const error = createUserError || updateFeaturesErrorForCreate;

  return { creating: isMutating || !!error, create };
};

export const useUpdateUser = () => {
  const { mutate: revalidateUserList } = useSWRConfig();

  const {
    trigger: triggerUpdateUserDetails,
    isMutating: updatingUserDetails,
    error: updateUserError,
  } = useSWRMutation(
    (userId: string) => `${ADMIN_USERS_API_URL}${userId}`,
    restfulUpdateUser
  );

  const {
    trigger: triggerUpdateFeaturesForUpdate,
    isMutating: updatingFeaturesForUpdate,
    error: updateFeaturesErrorForUpdate,
  } = useSWRMutation(
    (userId: string) => `${ADMIN_USERS_API_URL}${userId}/features`,
    restfulUpdateUserFeatures
  );

  const update = useAsyncCallback(
    async ({ userId, name, email, features }: UserInput & { userId: string }) => {
      try {
        await triggerUpdateUserDetails({ userId, name, email });
        await triggerUpdateFeaturesForUpdate({ userId, features });

        await revalidateUserList(ADMIN_USERS_API_URL);
        toast.success('Account updated successfully');
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        toast.error(`Failed to update account: ${message}`);
        console.error("Update user full error:", e, updateUserError, updateFeaturesErrorForUpdate);
      }
    },
    [triggerUpdateUserDetails, triggerUpdateFeaturesForUpdate, revalidateUserList, updateUserError, updateFeaturesErrorForUpdate]
  );

  const isMutating = updatingUserDetails || updatingFeaturesForUpdate;
  const error = updateUserError || updateFeaturesErrorForUpdate;

  return { updating: isMutating || !!error, update };
};

export const useResetUserPassword = () => {
  const [resetPasswordLink, setResetPasswordLink] = useState('');

  const { trigger: triggerCreateResetLink, isMutating, error } = useSWRMutation(
    (userId: string) => `${ADMIN_USERS_API_URL}${userId}/change-password-url`,
    restfulCreateChangePasswordUrl
  );

  const onResetPassword = useCallback(
    async (userId: string, callback?: () => void) => {
      setResetPasswordLink('');
      try {
        const newLink = await triggerCreateResetLink({
          userId,
          callbackUrl: '/auth/changePassword',
        });
        setResetPasswordLink(newLink);
        callback?.();
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        toast.error(`Failed to create reset password link: ${message}`);
        console.error("Create reset password link error:", e, error);
      }
    },
    [triggerCreateResetLink, error]
  );

  return useMemo(() => {
    return {
      resetPasswordLink,
      onResetPassword,
      isMutating,
      error,
    };
  }, [onResetPassword, resetPasswordLink, isMutating, error]);
};

export const useDeleteUser = () => {
  const { mutate: revalidateUserList } = useSWRConfig();
  const { trigger: triggerDeleteUser } = useSWRMutation(
    (userId: string) => `${ADMIN_USERS_API_URL}${userId}`,
    restfulDeleteUser
  );

  const deleteById = useAsyncCallback(
    async (userId: string, callback?: () => void) => {
      try {
        await triggerDeleteUser({ userId });
        await revalidateUserList(ADMIN_USERS_API_URL);
        toast.success('User deleted successfully');
        callback?.();
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        toast.error(`Failed to delete user: ${message}`);
      }
    },
    [triggerDeleteUser, revalidateUserList]
  );

  return deleteById;
};

export const useEnableUser = () => {
  const { mutate: revalidateUserList } = useSWRConfig();
  const { trigger: triggerEnableUser } = useSWRMutation(
    (userId: string) => `${ADMIN_USERS_API_URL}${userId}/enable`,
    restfulEnableUser
  );

  const enableById = useAsyncCallback(
    async (userId: string, callback?: () => void) => {
      try {
        const enabledUserData = await triggerEnableUser({ userId });
        await revalidateUserList(ADMIN_USERS_API_URL);
        toast.success(`User ${enabledUserData?.email || userId} enabled successfully`);
        callback?.();
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        toast.error(`Failed to enable user: ${message}`);
      }
    },
    [triggerEnableUser, revalidateUserList]
  );

  return enableById;
};
export const useDisableUser = () => {
  const { mutate: revalidateUserList } = useSWRConfig();
  const { trigger: triggerDisableUser } = useSWRMutation(
    (userId: string) => `${ADMIN_USERS_API_URL}${userId}/disable`,
    restfulDisableUser
  );

  const disableById = useAsyncCallback(
    async (userId: string, callback?: () => void) => {
      try {
        const disabledUserData = await triggerDisableUser({ userId });
        await revalidateUserList(ADMIN_USERS_API_URL);
        toast.success(`User ${disabledUserData?.email || userId} disabled successfully`);
        callback?.();
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        toast.error(`Failed to disable user: ${message}`);
      }
    },
    [triggerDisableUser, revalidateUserList]
  );

  return disableById;
};

export const useImportUsers = () => {
  const { mutate: revalidateUserList } = useSWRConfig();
  const { trigger: triggerImportUsers, isMutating, error } = useSWRMutation(
    ADMIN_USERS_IMPORT_API_URL, // Static URL for import
    restfulImportUsers // The new fetcher function
  );

  const handleImportUsers = useCallback(
    async (
      input: ImportUsersInput,
      callback?: (importData: UserImportReturnType) => void // Changed to importData for clarity
    ) => {
      try {
        const importedData = await triggerImportUsers({ input });
        await revalidateUserList(ADMIN_USERS_API_URL); // Revalidate the main user list
        callback?.(importedData);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        toast.error(`Failed to import users: ${message}`);
        console.error("Import users error:", e, error); // Log SWRMutation error as well
      }
    },
    [triggerImportUsers, revalidateUserList, error] // Added error as dependency
  );

  // Expose isMutating and error if needed by consumers of the hook
  // For now, just returning the handler function to maintain original signature.
  // return { handleImportUsers, isMutating, error };
  return handleImportUsers;
};

export const useExportUsers = () => {
  const exportCSV = useCallback(
    async (users: UserType[], fields: ExportField[], callback?: () => void) => {
      const selectedFields = fields
        .filter(field => field.checked)
        .map(field => field.id);

      if (selectedFields.length === 0) {
        alert('Please select at least one field to export');
        return;
      }

      const headers = selectedFields.map(
        fieldId => fields.find(field => field.id === fieldId)?.label || fieldId
      );

      const csvRows = [headers.join(',')];

      users.forEach(user => {
        const row = selectedFields.map(fieldId => {
          const value = user[fieldId as keyof UserType];

          return typeof value === 'string'
            ? `"${value.replace(/"/g, '""')}"`
            : String(value);
        });
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');

      // Add BOM (Byte Order Mark) to force Excel to interpret the file as UTF-8
      const BOM = '\uFEFF';
      const csvContentWithBOM = BOM + csvContent;

      const blob = new Blob([csvContentWithBOM], {
        type: 'text/csv;charset=utf-8;',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'exported_users.csv');
      link.style.visibility = 'hidden';
      document.body.append(link);
      link.click();

      setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(url);
      }, 100);

      callback?.();
    },
    []
  );

  const copyToClipboard = useCallback(
    async (users: UserType[], fields: ExportField[], callback?: () => void) => {
      const selectedFields = fields
        .filter(field => field.checked)
        .map(field => field.id);

      const dataToCopy: {
        [key: string]: string;
      }[] = [];
      users.forEach(user => {
        const row: { [key: string]: string } = {};
        selectedFields.forEach(fieldId => {
          const value = user[fieldId as keyof UserType];
          row[fieldId] = typeof value === 'string' ? value : String(value);
        });
        dataToCopy.push(row);
      });
      navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2));
      callback?.();
    },
    []
  );

  return {
    exportCSV,
    copyToClipboard,
  };
};
