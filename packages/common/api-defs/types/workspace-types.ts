import type {
  Scalars,
  Exact,
  Maybe,
  InputMaybe,
  UserType,
  Permission,
  DocType, // Used by WorkspaceType.doc, WorkspaceType.publicDocs, etc.
  PaginatedDocType, // Used by WorkspaceType.docs
  InvoiceType, // Used by WorkspaceType.invoices
  SubscriptionType, // Used by WorkspaceType.subscription
  License, // Used by WorkspaceType.license
  FeatureType, // Used by MutationAddWorkspaceFeatureArgs
  PaginationInput, // General utility
  PageInfo // General utility
} from './shared-types';
import type {
  CopilotWorkspaceConfig, // From copilot-types
  // Copilot related args for WorkspaceType fields might be here or in copilot-types
  // For now, assuming they are not needed directly in workspace-types for defining WorkspaceType itself
} from './copilot-types';
// DocHistoryType, EditorType, etc. might be better in doc-types.ts if primarily doc related
// For now, let's see what WorkspaceType directly references from schema.ts for its own structure.

// --- Enums specific to Workspace context if not already shared ---
export enum WorkspaceInviteLinkExpireTime {
  OneDay = 'OneDay',
  OneMonth = 'OneMonth',
  OneWeek = 'OneWeek',
  ThreeDays = 'ThreeDays',
}

export enum WorkspaceMemberStatus {
  Accepted = 'Accepted',
  AllocatingSeat = 'AllocatingSeat',
  NeedMoreSeat = 'NeedMoreSeat',
  NeedMoreSeatAndReview = 'NeedMoreSeatAndReview',
  Pending = 'Pending',
  UnderReview = 'UnderReview',
}

// --- Input Types ---
export interface UpdateWorkspaceInput {
  enableAi?: InputMaybe<Scalars['Boolean']['input']>;
  enableDocEmbedding?: InputMaybe<Scalars['Boolean']['input']>;
  enableUrlPreview?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  public?: InputMaybe<Scalars['Boolean']['input']>;
}

// --- Object Types related to Workspace members and invitations ---
export interface WorkspaceUserType { // Already in shared-types, but repeated here for clarity if it were workspace specific.
  __typename?: 'WorkspaceUserType';
  avatarUrl: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
}

export interface InviteUserType {
  __typename?: 'InviteUserType';
  avatarUrl: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['DateTime']['output']>;
  disabled: Maybe<Scalars['Boolean']['output']>;
  email: Maybe<Scalars['String']['output']>;
  emailVerified: Maybe<Scalars['Boolean']['output']>;
  hasPassword: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  inviteId: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  permission: Permission; // Enum from shared-types
  role: Permission; // Enum from shared-types
  status: WorkspaceMemberStatus;
}

export interface InvitationWorkspaceType {
  __typename?: 'InvitationWorkspaceType';
  avatar: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
}

export interface InvitationType {
  __typename?: 'InvitationType';
  invitee: WorkspaceUserType;
  status: Maybe<WorkspaceMemberStatus>;
  user: WorkspaceUserType;
  workspace: InvitationWorkspaceType;
}

export interface InviteLink {
  __typename?: 'InviteLink';
  expireTime: Scalars['DateTime']['output'];
  link: Scalars['String']['output'];
}

export interface InviteResult {
  __typename?: 'InviteResult';
  email: Scalars['String']['output'];
  error: Maybe<Scalars['JSONObject']['output']>;
  inviteId: Maybe<Scalars['String']['output']>;
  sentSuccess: Scalars['Boolean']['output'];
}


// --- Workspace Structure Types ---
export interface ListedBlob { // This was also in admin-types for ListBlobsQuery, could be shared if used elsewhere too
  __typename?: 'ListedBlob';
  createdAt: Scalars['String']['output'];
  key: Scalars['String']['output'];
  mime: Scalars['String']['output'];
  size: Scalars['Int']['output'];
}

export interface WorkspaceBlobSizes { // From schema, seems specific to workspace context
  __typename?: 'WorkspaceBlobSizes';
  size: Scalars['SafeInt']['output'];
}

// WorkspaceDocMeta and EditorType are closely related to Docs, might fit better in doc-types.ts
// but are part of WorkspaceType's structure via pageMeta.
export interface EditorType {
  __typename?: 'EditorType';
  avatarUrl: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
}

export interface WorkspaceDocMeta {
  __typename?: 'WorkspaceDocMeta';
  createdAt: Scalars['DateTime']['output'];
  createdBy: Maybe<EditorType>;
  updatedAt: Scalars['DateTime']['output'];
  updatedBy: Maybe<EditorType>;
}


export interface WorkspacePermissions {
  __typename?: 'WorkspacePermissions';
  Workspace_Administrators_Manage: Scalars['Boolean']['output'];
  Workspace_Blobs_List: Scalars['Boolean']['output'];
  Workspace_Blobs_Read: Scalars['Boolean']['output'];
  Workspace_Blobs_Write: Scalars['Boolean']['output'];
  Workspace_Copilot: Scalars['Boolean']['output'];
  Workspace_CreateDoc: Scalars['Boolean']['output'];
  Workspace_Delete: Scalars['Boolean']['output'];
  Workspace_Organize_Read: Scalars['Boolean']['output'];
  Workspace_Payment_Manage: Scalars['Boolean']['output'];
  Workspace_Properties_Create: Scalars['Boolean']['output'];
  Workspace_Properties_Delete: Scalars['Boolean']['output'];
  Workspace_Properties_Read: Scalars['Boolean']['output'];
  Workspace_Properties_Update: Scalars['Boolean']['output'];
  Workspace_Read: Scalars['Boolean']['output'];
  Workspace_Settings_Read: Scalars['Boolean']['output'];
  Workspace_Settings_Update: Scalars['Boolean']['output'];
  Workspace_Sync: Scalars['Boolean']['output'];
  Workspace_TransferOwner: Scalars['Boolean']['output'];
  Workspace_Users_Manage: Scalars['Boolean']['output'];
  Workspace_Users_Read: Scalars['Boolean']['output'];
}

export interface WorkspaceQuotaHumanReadableType {
  __typename?: 'WorkspaceQuotaHumanReadableType';
  blobLimit: Scalars['String']['output'];
  historyPeriod: Scalars['String']['output'];
  memberCount: Scalars['String']['output'];
  memberLimit: Scalars['String']['output'];
  name: Scalars['String']['output'];
  overcapacityMemberCount: Scalars['String']['output'];
  storageQuota: Scalars['String']['output'];
  storageQuotaUsed: Scalars['String']['output'];
}

export interface WorkspaceQuotaType {
  __typename?: 'WorkspaceQuotaType';
  blobLimit: Scalars['SafeInt']['output'];
  historyPeriod: Scalars['SafeInt']['output'];
  humanReadable: WorkspaceQuotaHumanReadableType;
  memberCount: Scalars['Int']['output'];
  memberLimit: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  overcapacityMemberCount: Scalars['Int']['output'];
  storageQuota: Scalars['SafeInt']['output'];
  usedSize: Scalars['SafeInt']['output']; // Deprecated in schema
  usedStorageQuota: Scalars['SafeInt']['output'];
}

// Forward declare types that might be fully defined in other domain-specific files
// For example, AggregateResultObjectType for workspace.aggregate, SearchResultObjectType for workspace.search
// DocHistoryType for workspace.histories
interface AggregateResultObjectType {} // Placeholder, full def in indexer-types.ts or similar
interface SearchResultObjectType {}    // Placeholder, full def in indexer-types.ts or similar
interface DocHistoryType {}           // Placeholder, full def in doc-types.ts or similar

// --- Main WorkspaceType Definition ---
// This is a simplified version for workspace-types.ts.
// The full WorkspaceType from schema.ts has many fields.
// We'll include fields directly managed by workspace operations.
// Fields like `doc`, `docs`, `aggregate`, `search`, `histories`, `embedding`, `subscription`, `license`
// will rely on types imported from their respective domain type files (doc, indexer, copilot, subscription, license).
export interface WorkspaceType {
  __typename?: 'WorkspaceType';
  // aggregate: AggregateResultObjectType; // Full type in indexer-types.ts
  // blobs: Array<ListedBlob>; // Defined above
  // blobsSize: Scalars['Int']['output']; // Scalar
  createdAt: Scalars['DateTime']['output'];
  // doc: DocType; // Full type in doc-types.ts
  // docs: PaginatedDocType; // Full type in doc-types.ts
  // embedding: CopilotWorkspaceConfig; // Full type in copilot-types.ts
  enableAi: Scalars['Boolean']['output'];
  enableDocEmbedding: Scalars['Boolean']['output'];
  enableUrlPreview: Scalars['Boolean']['output'];
  // histories: Array<DocHistoryType>; // Full type in doc-types.ts
  id: Scalars['ID']['output'];
  initialized: Scalars['Boolean']['output'];
  inviteLink: Maybe<InviteLink>; // Defined above
  // invoiceCount: Scalars['Int']['output']; // Scalar, part of Invoices
  // invoices: Array<InvoiceType>; // Full type in subscription-types.ts
  // license: Maybe<License>; // Full type in license-types.ts
  memberCount: Scalars['Int']['output'];
  members: Array<InviteUserType>; // Defined above
  owner: UserType; // From shared-types
  // pageMeta: WorkspaceDocMeta; // Defined above, but deprecated
  permissions: WorkspacePermissions; // Defined above
  public: Scalars['Boolean']['output'];
  // publicDocs: Array<DocType>; // Full type in doc-types.ts
  // publicPage: Maybe<DocType>; // Full type in doc-types.ts, deprecated
  // publicPages: Array<DocType>; // Full type in doc-types.ts, deprecated
  quota: WorkspaceQuotaType; // Defined above
  role: Permission; // Enum from shared-types
  // search: SearchResultObjectType; // Full type in indexer-types.ts
  // subscription: Maybe<SubscriptionType>; // Full type in subscription-types.ts
  team: Scalars['Boolean']['output'];
}


// --- Variable and Response types for Workspace operations ---

// CreateWorkspace
export type CreateWorkspaceMutationVariables = Exact<{
  init?: InputMaybe<Scalars['Upload']['input']>;
}>;
export type CreateWorkspaceMutation = {
  __typename?: 'Mutation';
  createWorkspace: Pick<WorkspaceType, '__typename' | 'id' | 'public' | 'createdAt'>;
};

// DeleteWorkspace
export type DeleteWorkspaceMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;
export type DeleteWorkspaceMutation = {
  __typename?: 'Mutation';
  deleteWorkspace: Scalars['Boolean']['output'];
};

// GetMembersByWorkspaceId
export type GetMembersByWorkspaceIdQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
}>;
export type GetMembersByWorkspaceIdQuery = {
  __typename?: 'Query';
  workspace: {
    __typename?: 'WorkspaceType';
    memberCount: Scalars['Int']['output'];
    members: Array<InviteUserType>;
  };
};

// GetMemberCountByWorkspaceId
export type GetMemberCountByWorkspaceIdQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
}>;
export type GetMemberCountByWorkspaceIdQuery = {
  __typename?: 'Query';
  workspace: {
    __typename?: 'WorkspaceType';
    memberCount: Scalars['Int']['output'];
  };
};

// GetWorkspaceInfo
export type GetWorkspaceInfoQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
}>;
export type GetWorkspaceInfoQuery = {
  __typename?: 'Query';
  workspace: Pick<WorkspaceType, '__typename' | 'role' | 'team'>;
};

// GetWorkspace (this is the one that takes ID and returns the Workspace object)
export type GetWorkspaceQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;
export type GetWorkspaceQuery = {
  __typename?: 'Query';
  workspace: WorkspaceType; // Or a Pick of it, depending on GQL file content for get-workspace.gql
};

// GetWorkspaces (plural)
export type GetWorkspacesQueryVariables = Exact<{ [key: string]: never }>;
export type GetWorkspacesQuery = {
  __typename?: 'Query';
  workspaces: Array<
    Pick<WorkspaceType, '__typename' | 'id' | 'initialized' | 'team'> & {
      owner: Pick<UserType, '__typename' | 'id'>;
    }
  >;
};

// LeaveWorkspace
export type LeaveWorkspaceMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  sendLeaveMail?: InputMaybe<Scalars['Boolean']['input']>;
}>;
export type LeaveWorkspaceMutation = {
  __typename?: 'Mutation';
  leaveWorkspace: Scalars['Boolean']['output'];
};

// RevokeMemberPermission (Revoke Member)
export type RevokeMemberPermissionMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;
export type RevokeMemberPermissionMutation = {
  __typename?: 'Mutation';
  revokeMember: Scalars['Boolean']['output'];
};

// SetWorkspacePublicById (UpdateWorkspace)
export type SetWorkspacePublicByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  public: Scalars['Boolean']['input'];
}>;
export type SetWorkspacePublicByIdMutation = {
  __typename?: 'Mutation';
  updateWorkspace: Pick<WorkspaceType, '__typename' | 'id'>; // Or full WorkspaceType
};

// WorkspaceBlobQuota
export type WorkspaceBlobQuotaQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;
export type WorkspaceBlobQuotaQuery = {
  __typename?: 'Query';
  workspace: {
    __typename?: 'WorkspaceType';
    quota: Pick<WorkspaceQuotaType, '__typename' | 'blobLimit'> & {
      humanReadable: Pick<WorkspaceQuotaHumanReadableType, '__typename' | 'blobLimit'>;
    }
  };
};

// GetWorkspaceConfig (this is the 'workspace' query with 'id' and specific config fields)
export type GetWorkspaceConfigQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;
export type GetWorkspaceConfigQuery = {
  __typename?: 'Query';
  workspace: Pick<WorkspaceType, '__typename' | 'enableAi' | 'enableUrlPreview' | 'enableDocEmbedding'> & {
    inviteLink: Maybe<Pick<InviteLink, '__typename' | 'link' | 'expireTime'>>;
  }
};

// SetEnableAi (UpdateWorkspace)
export type SetEnableAiMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  enableAi: Scalars['Boolean']['input'];
}>;
export type SetEnableAiMutation = {
  __typename?: 'Mutation';
  updateWorkspace: Pick<WorkspaceType, '__typename' | 'id'>; // Or full WorkspaceType
};

// SetEnableDocEmbedding (UpdateWorkspace)
export type SetEnableDocEmbeddingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  enableDocEmbedding: Scalars['Boolean']['input'];
}>;
export type SetEnableDocEmbeddingMutation = {
  __typename?: 'Mutation';
  updateWorkspace: Pick<WorkspaceType, '__typename' | 'id'>; // Or full WorkspaceType
};

// SetEnableUrlPreview (UpdateWorkspace)
export type SetEnableUrlPreviewMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  enableUrlPreview: Scalars['Boolean']['input'];
}>;
export type SetEnableUrlPreviewMutation = {
  __typename?: 'Mutation';
  updateWorkspace: Pick<WorkspaceType, '__typename' | 'id'>; // Or full WorkspaceType
};

// InviteByEmails (inviteMembers)
export type InviteByEmailsMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  emails: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;
export type InviteByEmailsMutation = {
  __typename?: 'Mutation';
  inviteMembers: Array<InviteResult>;
};

// AcceptInviteByInviteId
export type AcceptInviteByInviteIdMutationVariables = Exact<{
  workspaceId: Scalars['String']['input']; // Optional in schema, but often used
  inviteId: Scalars['String']['input'];
}>;
export type AcceptInviteByInviteIdMutation = {
  __typename?: 'Mutation';
  acceptInviteById: Scalars['Boolean']['output'];
};

// CreateInviteLink
export type CreateInviteLinkMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  expireTime: WorkspaceInviteLinkExpireTime;
}>;
export type CreateInviteLinkMutation = {
  __typename?: 'Mutation';
  createInviteLink: InviteLink;
};

// RevokeInviteLink
export type RevokeInviteLinkMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
}>;
export type RevokeInviteLinkMutation = {
  __typename?: 'Mutation';
  revokeInviteLink: Scalars['Boolean']['output'];
};

// WorkspaceQuota (full quota details)
export type WorkspaceQuotaQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;
export type WorkspaceQuotaQuery = {
  __typename?: 'Query';
  workspace: {
    __typename?: 'WorkspaceType';
    quota: WorkspaceQuotaType;
  };
};

// GetWorkspaceRolePermissions
export type WorkspaceRolePermissionsType = { // This is the inner part of the response
    __typename?: 'WorkspaceRolePermissions';
    permissions: WorkspacePermissions;
    role: Permission;
}
export type GetWorkspaceRolePermissionsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;
export type GetWorkspaceRolePermissionsQuery = {
  __typename?: 'Query';
  workspaceRolePermissions: WorkspaceRolePermissionsType;
};

// ApproveWorkspaceTeamMember
export type ApproveWorkspaceTeamMemberMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;
export type ApproveWorkspaceTeamMemberMutation = {
  __typename?: 'Mutation';
  approveMember: Scalars['Boolean']['output'];
};

// GrantWorkspaceTeamMember
export type GrantWorkspaceTeamMemberMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  permission: Permission;
}>;
export type GrantWorkspaceTeamMemberMutation = {
  __typename?: 'Mutation';
  grantMember: Scalars['Boolean']['output'];
};

// GetInviteInfo
export type GetInviteInfoQueryVariables = Exact<{
  inviteId: Scalars['String']['input'];
}>;
export type GetInviteInfoQuery = {
  __typename?: 'Query';
  getInviteInfo: InvitationType;
};

// MutationAddWorkspaceFeatureArgs (from schema, if used directly)
export interface MutationAddWorkspaceFeatureArgs {
  feature: FeatureType;
  workspaceId: Scalars['String']['input'];
}
// AddWorkspaceFeature (if there was a GQL file for it)
// export type AddWorkspaceFeatureMutationVariables = MutationAddWorkspaceFeatureArgs;
// export type AddWorkspaceFeatureMutation = {
//   __typename?: 'Mutation';
//   addWorkspaceFeature: Scalars['Boolean']['output'];
// };
// RemoveWorkspaceFeature (if there was a GQL file for it)
// export type RemoveWorkspaceFeatureMutationVariables = MutationAddWorkspaceFeatureArgs; // Same args
// export type RemoveWorkspaceFeatureMutation = {
//   __typename?: 'Mutation';
//   removeWorkspaceFeature: Scalars['Boolean']['output'];
// };

// WorkspaceType field argument types (if needed to be explicitly defined)
export interface WorkspaceTypeMembersArgs {
  query?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}
