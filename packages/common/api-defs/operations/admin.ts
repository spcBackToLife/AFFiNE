import type {
  AdminServerConfigQueryVariables,
  AdminServerConfigQuery,
  CreateChangePasswordUrlMutationVariables,
  CreateChangePasswordUrlMutation,
  AppConfigQueryVariables,
  AppConfigQuery,
  GetPromptsQueryVariables,
  GetPromptsQuery,
  UpdatePromptMutationVariables,
  UpdatePromptMutation,
  CreateUserMutationVariables,
  CreateUserMutation,
  DeleteUserMutationVariables,
  DeleteUserMutation,
  DisableUserMutationVariables,
  DisableUserMutation,
  EnableUserMutationVariables,
  EnableUserMutation,
  GetUserByEmailQueryVariables,
  GetUserByEmailQuery,
  ImportUsersMutationVariables,
  ImportUsersMutation,
  ListUsersQueryVariables,
  ListUsersQuery,
  SendTestEmailMutationVariables,
  SendTestEmailMutation,
  UpdateAccountFeaturesMutationVariables,
  UpdateAccountFeaturesMutation,
  UpdateAccountMutationVariables,
  UpdateAccountMutation,
  UpdateAppConfigMutationVariables,
  UpdateAppConfigMutation,
  ValidateConfigMutationVariables,
  ValidateConfigMutation,
  ListUserInput, // Direct input type
  CreateUserInput, // Direct input type
  ManageUserInput, // Direct input type
  UpdateAppConfigInput, // Direct input type
  ImportUsersInput, // Direct input type
  // Copilot related types used directly in operations
  CopilotPromptMessageInput,
} from '../types/admin-types';

// Shared types might also be needed for some specific variable/response structures not fully encapsulated
// For example, if a variable type is directly a shared type.
// However, the admin-types.ts should re-export or define most specific variable/response shapes.

export const adminServerConfig = {
  id: 'admin_server_config' as const,
  variablesType: null as unknown as AdminServerConfigQueryVariables,
  responseType: null as unknown as AdminServerConfigQuery,
};

export const adminUsersChangePasswordUrl = {
  id: 'admin_users_change_password_url' as const,
  variablesType: null as unknown as CreateChangePasswordUrlMutationVariables,
  responseType: null as unknown as CreateChangePasswordUrlMutation,
};

export const appConfig = {
  id: 'app_config' as const,
  variablesType: null as unknown as AppConfigQueryVariables,
  responseType: null as unknown as AppConfigQuery,
};

export const adminCopilotPromptList = {
  id: 'admin_copilot_prompt_list' as const,
  variablesType: null as unknown as GetPromptsQueryVariables,
  responseType: null as unknown as GetPromptsQuery,
};

export const adminCopilotPromptUpdate = {
  id: 'admin_copilot_prompt_update' as const,
  variablesType: null as unknown as UpdatePromptMutationVariables,
  responseType: null as unknown as UpdatePromptMutation,
};

export const adminUsersCreate = {
  id: 'admin_users_create' as const,
  variablesType: null as unknown as CreateUserMutationVariables,
  responseType: null as unknown as CreateUserMutation,
};

export const adminUsersDelete = {
  id: 'admin_users_delete' as const,
  variablesType: null as unknown as DeleteUserMutationVariables,
  responseType: null as unknown as DeleteUserMutation,
};

export const adminUsersDisable = {
  id: 'admin_users_disable' as const,
  variablesType: null as unknown as DisableUserMutationVariables,
  responseType: null as unknown as DisableUserMutation,
};

export const adminUsersEnable = {
  id: 'admin_users_enable' as const,
  variablesType: null as unknown as EnableUserMutationVariables,
  responseType: null as unknown as EnableUserMutation,
};

export const adminUsersGetByEmail = {
  id: 'admin_users_get_by_email' as const,
  variablesType: null as unknown as GetUserByEmailQueryVariables,
  responseType: null as unknown as GetUserByEmailQuery,
};

export const adminUsersImport = {
  id: 'admin_users_import' as const,
  variablesType: null as unknown as ImportUsersMutationVariables,
  responseType: null as unknown as ImportUsersMutation,
};

export const adminUsersList = {
  id: 'admin_users_list' as const,
  variablesType: null as unknown as ListUsersQueryVariables,
  responseType: null as unknown as ListUsersQuery,
};

export const adminSendTestEmail = {
  id: 'admin_send_test_email' as const,
  variablesType: null as unknown as SendTestEmailMutationVariables,
  responseType: null as unknown as SendTestEmailMutation,
};

export const adminUsersUpdateFeatures = {
  id: 'admin_users_update_features' as const,
  variablesType: null as unknown as UpdateAccountFeaturesMutationVariables,
  responseType: null as unknown as UpdateAccountFeaturesMutation,
};

export const adminUsersUpdateAccount = {
  id: 'admin_users_update_account' as const,
  variablesType: null as unknown as UpdateAccountMutationVariables,
  responseType: null as unknown as UpdateAccountMutation,
};

export const appUpdateConfig = {
  id: 'app_update_config' as const,
  variablesType: null as unknown as UpdateAppConfigMutationVariables,
  responseType: null as unknown as UpdateAppConfigMutation,
};

export const appValidateConfig = {
  id: 'app_validate_config' as const,
  variablesType: null as unknown as ValidateConfigMutationVariables,
  responseType: null as unknown as ValidateConfigMutation,
};
