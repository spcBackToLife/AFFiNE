import type {
  // WorkspaceType and its direct sub-types are in workspace-types.ts
  WorkspaceType,
  UpdateWorkspaceInput,
  InviteUserType,
  InvitationType,
  InviteLink,
  InviteResult,
  WorkspaceQuotaType,
  WorkspacePermissions,
  WorkspaceInviteLinkExpireTime,
  WorkspaceMemberStatus, // Enums
  // Specific query/mutation type shapes from workspace-types.ts
  CreateWorkspaceMutationVariables, CreateWorkspaceMutation,
  DeleteWorkspaceMutationVariables, DeleteWorkspaceMutation,
  GetMembersByWorkspaceIdQueryVariables, GetMembersByWorkspaceIdQuery,
  GetMemberCountByWorkspaceIdQueryVariables, GetMemberCountByWorkspaceIdQuery,
  GetWorkspaceInfoQueryVariables, GetWorkspaceInfoQuery,
  GetWorkspaceQueryVariables, GetWorkspaceQuery, // For specific getWorkspace(id)
  GetWorkspacesQueryVariables, GetWorkspacesQuery, // For listing all workspaces
  LeaveWorkspaceMutationVariables, LeaveWorkspaceMutation,
  RevokeMemberPermissionMutationVariables, RevokeMemberPermissionMutation,
  SetWorkspacePublicByIdMutationVariables, SetWorkspacePublicByIdMutation,
  WorkspaceBlobQuotaQueryVariables, WorkspaceBlobQuotaQuery,
  GetWorkspaceConfigQueryVariables, GetWorkspaceConfigQuery, // For workspace query with config fields
  SetEnableAiMutationVariables, SetEnableAiMutation,
  SetEnableDocEmbeddingMutationVariables, SetEnableDocEmbeddingMutation,
  SetEnableUrlPreviewMutationVariables, SetEnableUrlPreviewMutation,
  AcceptInviteByInviteIdMutationVariables, AcceptInviteByInviteIdMutation,
  InviteByEmailsMutationVariables, InviteByEmailsMutation,
  CreateInviteLinkMutationVariables, CreateInviteLinkMutation,
  RevokeInviteLinkMutationVariables, RevokeInviteLinkMutation,
  WorkspaceQuotaQueryVariables, WorkspaceQuotaQuery, // For workspace(id).quota
  GetWorkspaceRolePermissionsQueryVariables, GetWorkspaceRolePermissionsQuery,
  ApproveWorkspaceTeamMemberMutationVariables, ApproveWorkspaceTeamMemberMutation,
  GrantWorkspaceTeamMemberMutationVariables, GrantWorkspaceTeamMemberMutation,
  GetInviteInfoQueryVariables, GetInviteInfoQuery,
  WorkspaceInvoicesQueryVariables, WorkspaceInvoicesQuery,
} from '../types/workspace-types';
import type {
  Scalars, // For direct scalar variable types if any
  Permission, // Enum from shared
  UserType, // From shared
  InvoiceType, // From shared (or subscription-types if moved)
  PaginationInput, // From shared
} from '../types/shared-types';

export const workspaceCreate = {
  id: 'workspace_create' as const, // GQL: createWorkspace
  variablesType: null as unknown as CreateWorkspaceMutationVariables,
  responseType: null as unknown as CreateWorkspaceMutation,
};

export const workspaceDelete = {
  id: 'workspace_delete' as const, // GQL: deleteWorkspace
  variablesType: null as unknown as DeleteWorkspaceMutationVariables,
  responseType: null as unknown as DeleteWorkspaceMutation,
};

export const workspaceGetMembers = {
  id: 'workspace_get_members' as const, // GQL: getMembersByWorkspaceId (query workspace(id){members})
  variablesType: null as unknown as GetMembersByWorkspaceIdQueryVariables,
  responseType: null as unknown as GetMembersByWorkspaceIdQuery,
};

export const workspaceGetMemberCount = {
  id: 'workspace_get_member_count' as const, // GQL: getMemberCountByWorkspaceId (query workspace(id){memberCount})
  variablesType: null as unknown as GetMemberCountByWorkspaceIdQueryVariables,
  responseType: null as unknown as GetMemberCountByWorkspaceIdQuery,
};

export const workspaceGetInfo = {
  id: 'workspace_get_info' as const, // GQL: getWorkspaceInfo (query workspace(id){role team})
  variablesType: null as unknown as GetWorkspaceInfoQueryVariables,
  responseType: null as unknown as GetWorkspaceInfoQuery,
};

export const workspaceGetById = { // Covers get-workspace.gql
  id: 'workspace_get_by_id' as const, // GQL: getWorkspace(id)
  variablesType: null as unknown as GetWorkspaceQueryVariables,
  responseType: null as unknown as GetWorkspaceQuery,
};

export const workspacesList = { // Covers get-workspaces.gql
  id: 'workspaces_list' as const, // GQL: getWorkspaces
  variablesType: null as unknown as GetWorkspacesQueryVariables,
  responseType: null as unknown as GetWorkspacesQuery,
};

export const workspaceLeave = {
  id: 'workspace_leave' as const, // GQL: leaveWorkspace
  variablesType: null as unknown as LeaveWorkspaceMutationVariables,
  responseType: null as unknown as LeaveWorkspaceMutation,
};

export const workspaceRevokeMemberPermission = {
  id: 'workspace_revoke_member_permission' as const, // GQL: revokeMemberPermission (revokeMember mutation)
  variablesType: null as unknown as RevokeMemberPermissionMutationVariables,
  responseType: null as unknown as RevokeMemberPermissionMutation,
};

export const workspaceSetPublicById = { // Covers set-workspace-public-by-id.gql
  id: 'workspace_set_public_by_id' as const, // GQL: setWorkspacePublicById (updateWorkspace mutation)
  variablesType: null as unknown as SetWorkspacePublicByIdMutationVariables,
  responseType: null as unknown as SetWorkspacePublicByIdMutation,
};

export const workspaceGetBlobQuota = { // Covers workspace-blob-quota.gql
  id: 'workspace_get_blob_quota' as const, // GQL: workspaceBlobQuota (query workspace(id){quota{blobLimit}})
  variablesType: null as unknown as WorkspaceBlobQuotaQueryVariables,
  responseType: null as unknown as WorkspaceBlobQuotaQuery,
};

export const workspaceGetConfig = { // Covers workspace-config.gql
  id: 'workspace_get_config' as const, // GQL: getWorkspaceConfig (query workspace(id){enableAi inviteLink ...})
  variablesType: null as unknown as GetWorkspaceConfigQueryVariables,
  responseType: null as unknown as GetWorkspaceConfigQuery,
};

export const workspaceSetEnableAi = { // Covers workspace-enable-ai.gql
  id: 'workspace_set_enable_ai' as const, // GQL: setEnableAi (updateWorkspace mutation)
  variablesType: null as unknown as SetEnableAiMutationVariables,
  responseType: null as unknown as SetEnableAiMutation,
};

export const workspaceSetEnableDocEmbedding = { // Covers workspace-enable-doc-embedding.gql
  id: 'workspace_set_enable_doc_embedding' as const, // GQL: setEnableDocEmbedding (updateWorkspace mutation)
  variablesType: null as unknown as SetEnableDocEmbeddingMutationVariables,
  responseType: null as unknown as SetEnableDocEmbeddingMutation,
};

export const workspaceSetEnableUrlPreview = { // Covers workspace-enable-url-preview.gql
  id: 'workspace_set_enable_url_preview' as const, // GQL: setEnableUrlPreview (updateWorkspace mutation)
  variablesType: null as unknown as SetEnableUrlPreviewMutationVariables,
  responseType: null as unknown as SetEnableUrlPreviewMutation,
};

export const workspaceAcceptInvite = {
  id: 'workspace_accept_invite' as const, // GQL: acceptInviteByInviteId
  variablesType: null as unknown as AcceptInviteByInviteIdMutationVariables,
  responseType: null as unknown as AcceptInviteByInviteIdMutation,
};

export const workspaceInviteByEmails = {
  id: 'workspace_invite_by_emails' as const, // GQL: inviteByEmails (inviteMembers mutation)
  variablesType: null as unknown as InviteByEmailsMutationVariables,
  responseType: null as unknown as InviteByEmailsMutation,
};

export const workspaceCreateInviteLink = {
  id: 'workspace_create_invite_link' as const, // GQL: createInviteLink
  variablesType: null as unknown as CreateInviteLinkMutationVariables,
  responseType: null as unknown as CreateInviteLinkMutation,
};

export const workspaceRevokeInviteLink = {
  id: 'workspace_revoke_invite_link' as const, // GQL: revokeInviteLink
  variablesType: null as unknown as RevokeInviteLinkMutationVariables,
  responseType: null as unknown as RevokeInviteLinkMutation,
};

export const workspaceGetQuota = { // Covers workspace-quota.gql
  id: 'workspace_get_quota' as const, // GQL: workspaceQuota (query workspace(id){quota{...}})
  variablesType: null as unknown as WorkspaceQuotaQueryVariables,
  responseType: null as unknown as WorkspaceQuotaQuery,
};

export const workspaceGetRolePermissions = {
  id: 'workspace_get_role_permissions' as const, // GQL: getWorkspaceRolePermissions
  variablesType: null as unknown as GetWorkspaceRolePermissionsQueryVariables,
  responseType: null as unknown as GetWorkspaceRolePermissionsQuery,
};

export const workspaceApproveTeamMember = {
  id: 'workspace_approve_team_member' as const, // GQL: approveWorkspaceTeamMember (approveMember mutation)
  variablesType: null as unknown as ApproveWorkspaceTeamMemberMutationVariables,
  responseType: null as unknown as ApproveWorkspaceTeamMemberMutation,
};

export const workspaceGrantTeamMember = {
  id: 'workspace_grant_team_member' as const, // GQL: grantWorkspaceTeamMember (grantMember mutation)
  variablesType: null as unknown as GrantWorkspaceTeamMemberMutationVariables,
  responseType: null as unknown as GrantWorkspaceTeamMemberMutation,
};

export const workspaceGetInviteInfo = { // Covers get-invite-info.gql
  id: 'workspace_get_invite_info' as const, // GQL: getInviteInfo
  variablesType: null as unknown as GetInviteInfoQueryVariables,
  responseType: null as unknown as GetInviteInfoQuery,
};

export const workspaceGetInvoices = { // Covers workspace-invoices.gql
  id: 'workspace_get_invoices' as const, // GQL: workspaceInvoices (query workspace(id){invoices})
  variablesType: null as unknown as WorkspaceInvoicesQueryVariables,
  responseType: null as unknown as WorkspaceInvoicesQuery,
};
