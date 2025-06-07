import type {
  GetCurrentUserFeaturesQueryVariables,
  GetCurrentUserFeaturesQuery,
  GetCurrentUserQueryVariables,
  GetCurrentUserQuery,
  GetPublicUserByIdQueryVariables,
  GetPublicUserByIdQuery,
  GetUserFeaturesQueryVariables,
  GetUserFeaturesQuery,
  GetUserSettingsQueryVariables,
  GetUserSettingsQuery,
  GetUserQueryVariables,
  GetUserQuery,
  QuotaQueryVariables,
  QuotaQuery,
  RemoveAvatarMutationVariables,
  RemoveAvatarMutation,
  UpdateUserProfileMutationVariables,
  UpdateUserProfileMutation,
  UpdateUserSettingsMutationVariables,
  UpdateUserSettingsMutation,
  UploadAvatarMutationVariables,
  UploadAvatarMutation,
} from '../types/user-profile-types';

export const getCurrentUserFeatures = {
  id: 'user_get_current_features' as const, // GQL: getCurrentUserFeatures
  variablesType: null as unknown as GetCurrentUserFeaturesQueryVariables,
  responseType: null as unknown as GetCurrentUserFeaturesQuery,
};

export const getCurrentUser = {
  id: 'user_get_current' as const, // GQL: getCurrentUser
  variablesType: null as unknown as GetCurrentUserQueryVariables,
  responseType: null as unknown as GetCurrentUserQuery,
};

export const getPublicUserById = {
  id: 'user_get_public_by_id' as const, // GQL: getPublicUserById
  variablesType: null as unknown as GetPublicUserByIdQueryVariables,
  responseType: null as unknown as GetPublicUserByIdQuery,
};

export const getUserFeatures = {
  id: 'user_get_features' as const, // GQL: getUserFeatures (likely currentUser.features)
  variablesType: null as unknown as GetUserFeaturesQueryVariables,
  responseType: null as unknown as GetUserFeaturesQuery,
};

export const getUserSettings = {
  id: 'user_get_settings' as const, // GQL: getUserSettings
  variablesType: null as unknown as GetUserSettingsQueryVariables,
  responseType: null as unknown as GetUserSettingsQuery,
};

export const getUser = {
  id: 'user_get_by_email' as const, // GQL: getUser (by email)
  variablesType: null as unknown as GetUserQueryVariables,
  responseType: null as unknown as GetUserQuery,
};

export const userQuota = { // GQL query name is 'quota'
  id: 'user_get_quota' as const,
  variablesType: null as unknown as QuotaQueryVariables,
  responseType: null as unknown as QuotaQuery,
};

export const removeAvatar = {
  id: 'user_remove_avatar' as const, // GQL: removeAvatar
  variablesType: null as unknown as RemoveAvatarMutationVariables,
  responseType: null as unknown as RemoveAvatarMutation,
};

export const updateUserProfile = {
  id: 'user_update_profile' as const, // GQL: updateUserProfile
  variablesType: null as unknown as UpdateUserProfileMutationVariables,
  responseType: null as unknown as UpdateUserProfileMutation,
};

export const updateUserSettings = {
  id: 'user_update_settings' as const, // GQL: updateUserSettings
  variablesType: null as unknown as UpdateUserSettingsMutationVariables,
  responseType: null as unknown as UpdateUserSettingsMutation,
};

export const uploadAvatar = {
  id: 'user_upload_avatar' as const, // GQL: uploadAvatar
  variablesType: null as unknown as UploadAvatarMutationVariables,
  responseType: null as unknown as UploadAvatarMutation,
};
