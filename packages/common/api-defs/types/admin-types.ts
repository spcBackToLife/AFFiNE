import type {
  Scalars,
  InputMaybe,
  Exact,
  UserType,
  FeatureType,
  ServerFeature,
  ServerDeploymentType,
  CredentialsRequirementType,
  ReleaseVersionType,
  PasswordLimitsType, // Added this as it's a dependency for AdminServerConfigQuery
} from './shared-types';

// Input Types
export interface ListUserInput {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}

export interface CreateUserInput {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
}

export interface ManageUserInput {
  /** User email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** User name */
  name?: InputMaybe<Scalars['String']['input']>;
}

export interface UpdateAppConfigInput {
  key: Scalars['String']['input'];
  module: Scalars['String']['input'];
  value: Scalars['JSON']['input'];
}

export interface ImportUsersInput {
  users: Array<CreateUserInput>;
}

// Result/Output Types
export interface AppConfigValidateResult {
  __typename?: 'AppConfigValidateResult';
  error: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  module: Scalars['String']['output'];
  valid: Scalars['Boolean']['output'];
  value: Scalars['JSON']['output'];
}

export interface UserImportFailedType {
  __typename?: 'UserImportFailedType';
  email: Scalars['String']['output'];
  error: Scalars['String']['output'];
}

export type UserImportResultType = UserImportFailedType | UserType;

export interface DeleteAccount {
  __typename?: 'DeleteAccount';
  success: Scalars['Boolean']['output'];
}

// Copilot Prompt Related Types (as they are used in admin operations like GetPromptsQuery and UpdatePromptMutation)
export enum CopilotModels {
  DallE3 = 'DallE3',
  Gpt4Omni = 'Gpt4Omni',
  Gpt4Omni0806 = 'Gpt4Omni0806',
  Gpt4OmniMini = 'Gpt4OmniMini',
  Gpt4OmniMini0718 = 'Gpt4OmniMini0718',
  Gpt41 = 'Gpt41',
  Gpt41Mini = 'Gpt41Mini',
  Gpt41Nano = 'Gpt41Nano',
  Gpt410414 = 'Gpt410414',
  GptImage = 'GptImage',
  TextEmbedding3Large = 'TextEmbedding3Large',
  TextEmbedding3Small = 'TextEmbedding3Small',
  TextEmbeddingAda002 = 'TextEmbeddingAda002',
}

export interface CopilotPromptConfigInput {
  frequencyPenalty?: InputMaybe<Scalars['Float']['input']>;
  presencePenalty?: InputMaybe<Scalars['Float']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
  topP?: InputMaybe<Scalars['Float']['input']>;
}

export enum CopilotPromptMessageRole {
  assistant = 'assistant',
  system = 'system',
  user = 'user',
}

export interface CopilotPromptMessageInput {
  content: Scalars['String']['input'];
  params?: InputMaybe<Scalars['JSON']['input']>;
  role: CopilotPromptMessageRole;
}

export interface CopilotPromptConfigType {
  __typename?: 'CopilotPromptConfigType';
  frequencyPenalty: Maybe<Scalars['Float']['output']>;
  presencePenalty: Maybe<Scalars['Float']['output']>;
  temperature: Maybe<Scalars['Float']['output']>;
  topP: Maybe<Scalars['Float']['output']>;
}

export interface CopilotPromptMessageType {
  __typename?: 'CopilotPromptMessageType';
  content: Scalars['String']['output'];
  params: Maybe<Scalars['JSON']['output']>;
  role: CopilotPromptMessageRole;
}

export interface CopilotPromptType {
  __typename?: 'CopilotPromptType';
  action: Maybe<Scalars['String']['output']>;
  config: Maybe<CopilotPromptConfigType>;
  messages: Array<CopilotPromptMessageType>;
  model: Scalars['String']['output']; // Should ideally be CopilotModels, but schema uses String
  name: Scalars['String']['output'];
}

// Full Query/Mutation Types
export type AdminServerConfigQueryVariables = Exact<{ [key: string]: never }>;

export type AdminServerConfigQuery = {
  __typename?: 'Query';
  serverConfig: {
    __typename?: 'ServerConfigType';
    version: string;
    baseUrl: string;
    name: string;
    features: Array<ServerFeature>;
    type: ServerDeploymentType;
    initialized: boolean;
    availableUserFeatures: Array<FeatureType>;
    credentialsRequirement: {
      __typename?: 'CredentialsRequirementType';
      password: {
        __typename?: 'PasswordLimitsType';
        minLength: number;
        maxLength: number;
      };
    };
    availableUpgrade: {
      __typename?: 'ReleaseVersionType';
      changelog: string;
      version: string;
      publishedAt: string;
      url: string;
    } | null;
  };
};

export type CreateChangePasswordUrlMutationVariables = Exact<{
  callbackUrl: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;

export type CreateChangePasswordUrlMutation = {
  __typename?: 'Mutation';
  createChangePasswordUrl: string;
};

export type AppConfigQueryVariables = Exact<{ [key: string]: never }>;

export type AppConfigQuery = { __typename?: 'Query'; appConfig: any };

export type GetPromptsQueryVariables = Exact<{ [key: string]: never }>;

export type GetPromptsQuery = {
  __typename?: 'Query';
  listCopilotPrompts: Array<CopilotPromptType>;
};

export type UpdatePromptMutationVariables = Exact<{
  name: Scalars['String']['input'];
  messages: Array<CopilotPromptMessageInput> | CopilotPromptMessageInput;
}>;

export type UpdatePromptMutation = {
  __typename?: 'Mutation';
  updateCopilotPrompt: CopilotPromptType;
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;

export type CreateUserMutation = {
  __typename?: 'Mutation';
  createUser: { __typename?: 'UserType'; id: string }; // Assuming UserType from shared-types is sufficient
};

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteUserMutation = {
  __typename?: 'Mutation';
  deleteUser: DeleteAccount;
};

export type DisableUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DisableUserMutation = {
  __typename?: 'Mutation';
  banUser: { __typename?: 'UserType'; email: string; disabled: boolean }; // Assuming UserType from shared-types
};

export type EnableUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type EnableUserMutation = {
  __typename?: 'Mutation';
  enableUser: { __typename?: 'UserType'; email: string; disabled: boolean }; // Assuming UserType from shared-types
};

export type GetUserByEmailQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;

export type GetUserByEmailQuery = {
  __typename?: 'Query';
  userByEmail: { // This is essentially a subset of UserType
    __typename?: 'UserType';
    id: string;
    name: string;
    email: string;
    features: Array<FeatureType>;
    hasPassword: boolean | null;
    emailVerified: boolean;
    avatarUrl: string | null;
    disabled: boolean;
  } | null;
};

export type ImportUsersMutationVariables = Exact<{
  input: ImportUsersInput;
}>;

export type ImportUsersMutation = {
  __typename?: 'Mutation';
  importUsers: Array<UserImportResultType>;
};

export type ListUsersQueryVariables = Exact<{
  filter: ListUserInput;
}>;

export type ListUsersQuery = {
  __typename?: 'Query';
  usersCount: number;
  users: Array<{ // This is essentially a subset of UserType
    __typename?: 'UserType';
    id: string;
    name: string;
    email: string;
    disabled: boolean;
    features: Array<FeatureType>;
    hasPassword: boolean | null;
    emailVerified: boolean;
    avatarUrl: string | null;
  }>;
};

export type SendTestEmailMutationVariables = Exact<{
  host: Scalars['String']['input'];
  port: Scalars['Int']['input'];
  sender: Scalars['String']['input'];
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  ignoreTLS: Scalars['Boolean']['input'];
}>;

export type SendTestEmailMutation = {
  __typename?: 'Mutation';
  sendTestEmail: boolean;
};

export type UpdateAccountFeaturesMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  features: Array<FeatureType> | FeatureType;
}>;

export type UpdateAccountFeaturesMutation = {
  __typename?: 'Mutation';
  updateUserFeatures: Array<FeatureType>;
};

export type UpdateAccountMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: ManageUserInput;
}>;

export type UpdateAccountMutation = {
  __typename?: 'Mutation';
  updateUser: { // This is essentially a subset of UserType
    __typename?: 'UserType';
    id: string;
    name: string;
    email: string;
  };
};

export type UpdateAppConfigMutationVariables = Exact<{
  updates: Array<UpdateAppConfigInput> | UpdateAppConfigInput;
}>;

export type UpdateAppConfigMutation = {
  __typename?: 'Mutation';
  updateAppConfig: any;
};

export type ValidateConfigMutationVariables = Exact<{
  updates: Array<UpdateAppConfigInput> | UpdateAppConfigInput;
}>;

export type ValidateConfigMutation = {
  __typename?: 'Mutation';
  validateAppConfig: Array<AppConfigValidateResult>;
};

// ServerConfigType itself, if needed directly by admin operations beyond AdminServerConfigQuery
// It's already imported via shared-types for AdminServerConfigQuery, so no need to redefine.
// export type ServerConfigType = ServerConfigType; // from shared-types

// Placeholder for the full Copilot type definition if it were to be fully included here.
// For now, specific parts like CopilotPromptType are included as they are directly part of admin GQL operations.
// The `Copilot` type itself is referenced in `UserType` from `shared-types.ts`.
// If other parts of `Copilot` type (like `CopilotContext`, `CopilotHistories`, `CopilotQuota`, `CopilotSessionType`)
// were directly part of *admin* operation results (not nested under UserType), they would be added here.
// Since UserType is in shared-types, its internal structure (including its `copilot` field) is defined there.
// The current admin operations (GetPrompts, UpdatePrompt) deal with `CopilotPromptType` directly.
export type Maybe<T> = T | null; // Already in shared-types, but good for completeness if this file was standalone
