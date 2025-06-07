import type {
  Scalars,
  Exact,
  Maybe,
  InputMaybe,
  UserType, // Base UserType from shared
  FeatureType,
  UserSettingsType, // Already in shared-types, but good to list if extended
  UserQuotaType, // Already in shared-types
  LimitedUserType, // Already in shared-types
  UserOrLimitedUser, // Already in shared-types
  TokenType, // Already in shared-types
  RemoveAvatar, // This is a distinct response type
} from './shared-types';
// Re-import Copilot from copilot-types for UserType's copilot field if we were making UserType specific here.
// However, the task is to update UserType in shared-types.ts later if Copilot type is made more specific.
// For now, UserType imported from shared-types will have its existing Copilot placeholder.

// Input types
export interface UpdateUserInput {
  name?: InputMaybe<Scalars['String']['input']>;
}

export interface UpdateUserSettingsInput {
  receiveInvitationEmail?: InputMaybe<Scalars['Boolean']['input']>;
  receiveMentionEmail?: InputMaybe<Scalars['Boolean']['input']>;
}

// Query Variable & Response Types

// GetCurrentUserFeaturesQuery
export type GetCurrentUserFeaturesQueryVariables = Exact<{ [key: string]: never }>;
export type GetCurrentUserFeaturesQuery = {
  __typename?: 'Query';
  currentUser: Maybe<
    Pick<UserType, '__typename' | 'id' | 'name' | 'email' | 'emailVerified' | 'avatarUrl' | 'features'>
  >;
};

// GetCurrentUserQuery
export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>;
export type GetCurrentUserQuery = {
  __typename?: 'Query';
  currentUser: Maybe<
    Pick<UserType, '__typename' | 'id' | 'name' | 'email' | 'emailVerified' | 'avatarUrl'> & {
      token: Pick<TokenType, '__typename' | 'sessionToken'>;
    }
  >;
};

// GetPublicUserByIdQuery
export type GetPublicUserByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;
export type GetPublicUserByIdQuery = {
  __typename?: 'Query';
  publicUserById: Maybe<{ // This is PublicUserType from shared-types
    __typename?: 'PublicUserType';
    id: Scalars['String']['output'];
    avatarUrl: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
  }>;
};

// GetUserFeaturesQuery (distinct from GetCurrentUserFeaturesQuery by not being on `currentUser`)
export type GetUserFeaturesQueryVariables = Exact<{ [key: string]: never }>; // This seems odd, usually would take an ID
                                                                    // Based on schema, it might be a general query not specific to one user,
                                                                    // or it's intended to be used on `currentUser` but the GQL is different.
                                                                    // For now, following the schema's potential variable structure.
                                                                    // If it's on `UserType` itself (e.g. `user { features }`), it'd need user ID.
                                                                    // Given the GQL file list, this might be `currentUser.features`
                                                                    // Let's assume it's for the current user as per typical patterns.
export type GetUserFeaturesQuery = {
  __typename?: 'Query';
  currentUser: Maybe<Pick<UserType, '__typename'| 'id' | 'features'>>;
};


// GetUserSettingsQuery
export type GetUserSettingsQueryVariables = Exact<{ [key: string]: never }>;
export type GetUserSettingsQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    settings: UserSettingsType;
  }>;
};

// GetUserQuery
export type GetUserQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;
export type GetUserQuery = {
  __typename?: 'Query';
  user: Maybe<UserOrLimitedUser>; // UserOrLimitedUser is from shared-types
};

// QuotaQuery (currentUser.quota)
export type QuotaQueryVariables = Exact<{ [key: string]: never }>;
export type QuotaQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    id: string;
    quota: UserQuotaType; // UserQuotaType is from shared-types
    quotaUsage: { __typename?: 'UserQuotaUsageType'; storageQuota: Scalars['SafeInt']['output'] };
  }>;
};


// Mutation Variable & Response Types

// RemoveAvatarMutation
export type RemoveAvatarMutationVariables = Exact<{ [key: string]: never }>;
export type RemoveAvatarMutation = {
  __typename?: 'Mutation';
  removeAvatar: RemoveAvatar; // RemoveAvatar type is from shared-types
};

// UpdateUserProfileMutation
export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserInput;
}>;
export type UpdateUserProfileMutation = {
  __typename?: 'Mutation';
  updateProfile: Pick<UserType, '__typename' | 'id' | 'name'>;
};

// UpdateUserSettingsMutation
export type UpdateUserSettingsMutationVariables = Exact<{
  input: UpdateUserSettingsInput;
}>;
export type UpdateUserSettingsMutation = {
  __typename?: 'Mutation';
  updateSettings: Scalars['Boolean']['output'];
};

// UploadAvatarMutation
export type UploadAvatarMutationVariables = Exact<{
  avatar: Scalars['Upload']['input'];
}>;
export type UploadAvatarMutation = {
  __typename?: 'Mutation';
  uploadAvatar: Pick<UserType, '__typename' | 'id' | 'name' | 'avatarUrl' | 'email'>;
};
