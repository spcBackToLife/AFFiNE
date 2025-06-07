export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };

/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: Record<string, string>; output: Record<string, string> };
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any };
  /** The `SafeInt` scalar type represents non-fractional signed whole numeric values that are considered safe as defined by the ECMAScript specification. */
  SafeInt: { input: number; output: number };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: File; output: File };
}

// Import the detailed Copilot type
import type { Copilot as ActualCopilot } from './copilot-types';

export enum FeatureType {
  AIEarlyAccess = 'AIEarlyAccess',
  Admin = 'Admin',
  EarlyAccess = 'EarlyAccess',
  FreePlan = 'FreePlan',
  LifetimeProPlan = 'LifetimeProPlan',
  ProPlan = 'ProPlan',
  TeamPlan = 'TeamPlan',
  UnlimitedCopilot = 'UnlimitedCopilot',
  UnlimitedWorkspace = 'UnlimitedWorkspace',
}

export interface PublicUserType {
  __typename?: 'PublicUserType';
  avatarUrl: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
}

/** User permission in workspace */
export enum Permission {
  Admin = 'Admin',
  Collaborator = 'Collaborator',
  External = 'External',
  Owner = 'Owner',
}

/** User permission in doc */
export enum DocRole {
  Editor = 'Editor',
  External = 'External',
  Manager = 'Manager',
  None = 'None',
  Owner = 'Owner',
  Reader = 'Reader',
}

export enum ServerFeature {
  Captcha = 'Captcha',
  Copilot = 'Copilot',
  CopilotEmbedding = 'CopilotEmbedding',
  Indexer = 'Indexer',
  OAuth = 'OAuth',
  Payment = 'Payment',
}

export enum OAuthProviderType {
  Apple = 'Apple',
  GitHub = 'GitHub',
  Google = 'Google',
  OIDC = 'OIDC',
}

export enum ServerDeploymentType {
  Affine = 'Affine',
  Selfhosted = 'Selfhosted',
}

export interface PasswordLimitsType {
  __typename?: 'PasswordLimitsType';
  maxLength: Scalars['Int']['output'];
  minLength: Scalars['Int']['output'];
}

export interface CredentialsRequirementType {
  __typename?: 'CredentialsRequirementType';
  password: PasswordLimitsType;
}

export interface ReleaseVersionType {
  __typename?: 'ReleaseVersionType';
  changelog: Scalars['String']['output'];
  publishedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  version: Scalars['String']['output'];
}

export interface UserSettingsType {
  __typename?: 'UserSettingsType';
  /** Receive invitation email */
  receiveInvitationEmail: Scalars['Boolean']['output'];
  /** Receive mention email */
  receiveMentionEmail: Scalars['Boolean']['output'];
}

export interface UserQuotaHumanReadableType {
  __typename?: 'UserQuotaHumanReadableType';
  blobLimit: Scalars['String']['output'];
  copilotActionLimit: Scalars['String']['output'];
  historyPeriod: Scalars['String']['output'];
  memberLimit: Scalars['String']['output'];
  name: Scalars['String']['output'];
  storageQuota: Scalars['String']['output'];
  usedStorageQuota: Scalars['String']['output'];
}

export interface UserQuotaType {
  __typename?: 'UserQuotaType';
  blobLimit: Scalars['SafeInt']['output'];
  copilotActionLimit: Maybe<Scalars['Int']['output']>;
  historyPeriod: Scalars['SafeInt']['output'];
  humanReadable: UserQuotaHumanReadableType;
  memberLimit: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  storageQuota: Scalars['SafeInt']['output'];
  usedStorageQuota: Scalars['SafeInt']['output'];
}

export interface UserQuotaUsageType {
  __typename?: 'UserQuotaUsageType';
  /** @deprecated use `UserQuotaType['usedStorageQuota']` instead */
  storageQuota: Scalars['SafeInt']['output'];
}

export interface InvoiceType {
  __typename?: 'InvoiceType';
  amount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  /** @deprecated removed */
  id: Maybe<Scalars['String']['output']>;
  lastPaymentError: Maybe<Scalars['String']['output']>;
  link: Maybe<Scalars['String']['output']>;
  /** @deprecated removed */
  plan: Maybe<SubscriptionPlan>;
  reason: Scalars['String']['output'];
  /** @deprecated removed */
  recurring: Maybe<SubscriptionRecurring>;
  status: InvoiceStatus;
  updatedAt: Scalars['DateTime']['output'];
}

export enum InvoiceStatus {
  Draft = 'Draft',
  Open = 'Open',
  Paid = 'Paid',
  Uncollectible = 'Uncollectible',
  Void = 'Void',
}

export enum SubscriptionPlan {
  AI = 'AI',
  Enterprise = 'Enterprise',
  Free = 'Free',
  Pro = 'Pro',
  SelfHosted = 'SelfHosted',
  SelfHostedTeam = 'SelfHostedTeam',
  Team = 'Team',
}

export enum SubscriptionRecurring {
  Lifetime = 'Lifetime',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export enum SubscriptionStatus {
  Active = 'Active',
  Canceled = 'Canceled',
  Incomplete = 'Incomplete',
  IncompleteExpired = 'IncompleteExpired',
  PastDue = 'PastDue',
  Paused = 'Paused',
  Trialing = 'Trialing',
  Unpaid = 'Unpaid',
}

export enum SubscriptionVariant {
  EA = 'EA',
  Onetime = 'Onetime',
}

export interface SubscriptionType {
  __typename?: 'SubscriptionType';
  canceledAt: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  end: Maybe<Scalars['DateTime']['output']>;
  /** @deprecated removed */
  id: Maybe<Scalars['String']['output']>;
  nextBillAt: Maybe<Scalars['DateTime']['output']>;
  /**
   * The 'Free' plan just exists to be a placeholder and for the type convenience of frontend.
   * There won't actually be a subscription with plan 'Free'
   */
  plan: SubscriptionPlan;
  recurring: SubscriptionRecurring;
  start: Scalars['DateTime']['output'];
  status: SubscriptionStatus;
  trialEnd: Maybe<Scalars['DateTime']['output']>;
  trialStart: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  variant: Maybe<SubscriptionVariant>;
}

export interface TokenType {
  __typename?: 'tokenType';
  refresh: Scalars['String']['output'];
  sessionToken: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
}

// Forward declaration for UserType's Copilot field is removed.

export interface UserType {
  __typename?: 'UserType';
  /** User avatar url */
  avatarUrl: Maybe<Scalars['String']['output']>;
  copilot: ActualCopilot; // Use the imported detailed Copilot type
  /**
   * User email verified
   * @deprecated useless
   */
  createdAt: Maybe<Scalars['DateTime']['output']>;
  /** User is disabled */
  disabled: Scalars['Boolean']['output'];
  /** User email */
  email: Scalars['String']['output'];
  /** User email verified */
  emailVerified: Scalars['Boolean']['output'];
  /** Enabled features of a user */
  features: Array<FeatureType>;
  /** User password has been set */
  hasPassword: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  /** Get user invoice count */
  invoiceCount: Scalars['Int']['output'];
  invoices: Array<InvoiceType>;
  /** User name */
  name: Scalars['String']['output'];
  /** Get user notification count */
  notificationCount: Scalars['Int']['output'];
  /** Get current user notifications */
  notifications: PaginatedNotificationObjectType; // Requires PaginatedNotificationObjectType
  quota: UserQuotaType;
  quotaUsage: UserQuotaUsageType;
  /** Get user settings */
  settings: UserSettingsType;
  subscriptions: Array<SubscriptionType>;
  /** @deprecated use [/api/auth/sign-in?native=true] instead */
  token: TokenType;
}

// Related to UserType.notifications
export interface PageInfo {
  __typename?: 'PageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Maybe<Scalars['String']['output']>;
}

export interface NotificationObjectType {
  __typename?: 'NotificationObjectType';
  /** Just a placeholder to export UnionNotificationBodyType, don't use it */
  _placeholderForUnionNotificationBodyType: UnionNotificationBodyType; // Requires UnionNotificationBodyType
  /** The body of the notification, different types have different fields, see UnionNotificationBodyType */
  body: Scalars['JSONObject']['output'];
  /** The created at time of the notification */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** The level of the notification */
  level: NotificationLevel; // Requires NotificationLevel
  /** Whether the notification has been read */
  read: Scalars['Boolean']['output'];
  /** The type of the notification */
  type: NotificationType; // Requires NotificationType
  /** The updated at time of the notification */
  updatedAt: Scalars['DateTime']['output'];
}

export interface NotificationObjectTypeEdge {
  __typename?: 'NotificationObjectTypeEdge';
  cursor: Scalars['String']['output'];
  node: NotificationObjectType;
}

export interface PaginatedNotificationObjectType {
  __typename?: 'PaginatedNotificationObjectType';
  edges: Array<NotificationObjectTypeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

// Enums and types required by NotificationObjectType and its dependencies
export enum NotificationLevel {
  Default = 'Default',
  High = 'High',
  Low = 'Low',
  Min = 'Min',
  None = 'None',
}

export enum NotificationType {
  Invitation = 'Invitation',
  InvitationAccepted = 'InvitationAccepted',
  InvitationBlocked = 'InvitationBlocked',
  InvitationRejected = 'InvitationRejected',
  InvitationReviewApproved = 'InvitationReviewApproved',
  InvitationReviewDeclined = 'InvitationReviewDeclined',
  InvitationReviewRequest = 'InvitationReviewRequest',
  Mention = 'Mention',
}

export interface NotificationWorkspaceType {
  __typename?: 'NotificationWorkspaceType';
  /** Workspace avatar url */
  avatarUrl: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** Workspace name */
  name: Scalars['String']['output'];
}

// UnionNotificationBodyType and its constituent types
export interface InvitationAcceptedNotificationBodyType {
  __typename?: 'InvitationAcceptedNotificationBodyType';
  /** The user who created the notification, maybe null when user is deleted or sent by system */
  createdByUser: Maybe<PublicUserType>;
  inviteId: Scalars['ID']['output'];
  /** The type of the notification */
  type: NotificationType;
  workspace: Maybe<NotificationWorkspaceType>;
}

export interface InvitationBlockedNotificationBodyType {
  __typename?: 'InvitationBlockedNotificationBodyType';
  /** The user who created the notification, maybe null when user is deleted or sent by system */
  createdByUser: Maybe<PublicUserType>;
  inviteId: Scalars['ID']['output'];
  /** The type of the notification */
  type: NotificationType;
  workspace: Maybe<NotificationWorkspaceType>;
}

export interface InvitationNotificationBodyType {
  __typename?: 'InvitationNotificationBodyType';
  /** The user who created the notification, maybe null when user is deleted or sent by system */
  createdByUser: Maybe<PublicUserType>;
  inviteId: Scalars['ID']['output'];
  /** The type of the notification */
  type: NotificationType;
  workspace: Maybe<NotificationWorkspaceType>;
}

export interface InvitationReviewApprovedNotificationBodyType {
  __typename?: 'InvitationReviewApprovedNotificationBodyType';
  /** The user who created the notification, maybe null when user is deleted or sent by system */
  createdByUser: Maybe<PublicUserType>;
  inviteId: Scalars['ID']['output'];
  /** The type of the notification */
  type: NotificationType;
  workspace: Maybe<NotificationWorkspaceType>;
}

export interface InvitationReviewDeclinedNotificationBodyType {
  __typename?: 'InvitationReviewDeclinedNotificationBodyType';
  /** The user who created the notification, maybe null when user is deleted or sent by system */
  createdByUser: Maybe<PublicUserType>;
  /** The type of the notification */
  type: NotificationType;
  workspace: Maybe<NotificationWorkspaceType>;
}

export interface InvitationReviewRequestNotificationBodyType {
  __typename?: 'InvitationReviewRequestNotificationBodyType';
  /** The user who created the notification, maybe null when user is deleted or sent by system */
  createdByUser: Maybe<PublicUserType>;
  inviteId: Scalars['ID']['output'];
  /** The type of the notification */
  type: NotificationType;
  workspace: Maybe<NotificationWorkspaceType>;
}

/** Doc mode */
export enum DocMode {
  edgeless = 'edgeless',
  page = 'page',
}

export interface MentionDocInput {
  /** The block id in the doc */
  blockId?: InputMaybe<Scalars['String']['input']>;
  /** The element id in the doc */
  elementId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  mode: DocMode;
  title: Scalars['String']['input'];
}

export interface MentionDocType {
  __typename?: 'MentionDocType';
  blockId: Maybe<Scalars['String']['output']>;
  elementId: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  mode: DocMode;
  title: Scalars['String']['output'];
}

export interface MentionNotificationBodyType {
  __typename?: 'MentionNotificationBodyType';
  /** The user who created the notification, maybe null when user is deleted or sent by system */
  createdByUser: Maybe<PublicUserType>;
  doc: MentionDocType;
  /** The type of the notification */
  type: NotificationType;
  workspace: Maybe<NotificationWorkspaceType>;
}

export type UnionNotificationBodyType =
  | InvitationAcceptedNotificationBodyType
  | InvitationBlockedNotificationBodyType
  | InvitationNotificationBodyType
  | InvitationReviewApprovedNotificationBodyType
  | InvitationReviewDeclinedNotificationBodyType
  | InvitationReviewRequestNotificationBodyType
  | MentionNotificationBodyType;


// Error related types
export interface AlreadyInSpaceDataType {
  __typename?: 'AlreadyInSpaceDataType';
  spaceId: Scalars['String']['output'];
}

export interface BlobNotFoundDataType {
  __typename?: 'BlobNotFoundDataType';
  blobId: Scalars['String']['output'];
  spaceId: Scalars['String']['output'];
}

export interface CopilotContextFileNotSupportedDataType {
  __typename?: 'CopilotContextFileNotSupportedDataType';
  fileName: Scalars['String']['output'];
  message: Scalars['String']['output'];
}

export interface CopilotDocNotFoundDataType {
  __typename?: 'CopilotDocNotFoundDataType';
  docId: Scalars['String']['output'];
}

export interface CopilotFailedToAddWorkspaceFileEmbeddingDataType {
  __typename?: 'CopilotFailedToAddWorkspaceFileEmbeddingDataType';
  message: Scalars['String']['output'];
}

export interface CopilotFailedToMatchContextDataType {
  __typename?: 'CopilotFailedToMatchContextDataType';
  content: Scalars['String']['output'];
  contextId: Scalars['String']['output'];
  message: Scalars['String']['output'];
}

export interface CopilotFailedToMatchGlobalContextDataType {
  __typename?: 'CopilotFailedToMatchGlobalContextDataType';
  content: Scalars['String']['output'];
  message: Scalars['String']['output'];
  workspaceId: Scalars['String']['output'];
}

export interface CopilotFailedToModifyContextDataType {
  __typename?: 'CopilotFailedToModifyContextDataType';
  contextId: Scalars['String']['output'];
  message: Scalars['String']['output'];
}

export interface CopilotInvalidContextDataType {
  __typename?: 'CopilotInvalidContextDataType';
  contextId: Scalars['String']['output'];
}

export interface CopilotMessageNotFoundDataType {
  __typename?: 'CopilotMessageNotFoundDataType';
  messageId: Scalars['String']['output'];
}

export interface CopilotPromptNotFoundDataType {
  __typename?: 'CopilotPromptNotFoundDataType';
  name: Scalars['String']['output'];
}

export interface CopilotProviderNotSupportedDataType {
  __typename?: 'CopilotProviderNotSupportedDataType';
  kind: Scalars['String']['output'];
  provider: Scalars['String']['output'];
}

export interface CopilotProviderSideErrorDataType {
  __typename?: 'CopilotProviderSideErrorDataType';
  kind: Scalars['String']['output'];
  message: Scalars['String']['output'];
  provider: Scalars['String']['output'];
}

export interface DocActionDeniedDataType {
  __typename?: 'DocActionDeniedDataType';
  action: Scalars['String']['output'];
  docId: Scalars['String']['output'];
  spaceId: Scalars['String']['output'];
}

export interface DocHistoryNotFoundDataType {
  __typename?: 'DocHistoryNotFoundDataType';
  docId: Scalars['String']['output'];
  spaceId: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
}

export interface DocNotFoundDataType {
  __typename?: 'DocNotFoundDataType';
  docId: Scalars['String']['output'];
  spaceId: Scalars['String']['output'];
}

export interface DocUpdateBlockedDataType {
  __typename?: 'DocUpdateBlockedDataType';
  docId: Scalars['String']['output'];
  spaceId: Scalars['String']['output'];
}

export interface ExpectToGrantDocUserRolesDataType {
  __typename?: 'ExpectToGrantDocUserRolesDataType';
  docId: Scalars['String']['output'];
  spaceId: Scalars['String']['output'];
}

export interface ExpectToRevokeDocUserRolesDataType {
  __typename?: 'ExpectToRevokeDocUserRolesDataType';
  docId: Scalars['String']['output'];
  spaceId: Scalars['String']['output'];
}

export interface ExpectToUpdateDocUserRoleDataType {
  __typename?: 'ExpectToUpdateDocUserRoleDataType';
  docId: Scalars['String']['output'];
  spaceId: Scalars['String']['output'];
}

export interface GraphqlBadRequestDataType {
  __typename?: 'GraphqlBadRequestDataType';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
}

export interface HttpRequestErrorDataType {
  __typename?: 'HttpRequestErrorDataType';
  message: Scalars['String']['output'];
}

export interface InvalidAppConfigDataType {
  __typename?: 'InvalidAppConfigDataType';
  hint: Scalars['String']['output'];
  key: Scalars['String']['output'];
  module: Scalars['String']['output'];
}

export interface InvalidAppConfigInputDataType {
  __typename?: 'InvalidAppConfigInputDataType';
  message: Scalars['String']['output'];
}

export interface InvalidEmailDataType {
  __typename?: 'InvalidEmailDataType';
  email: Scalars['String']['output'];
}

export interface InvalidHistoryTimestampDataType {
  __typename?: 'InvalidHistoryTimestampDataType';
  timestamp: Scalars['String']['output'];
}

export interface InvalidIndexerInputDataType {
  __typename?: 'InvalidIndexerInputDataType';
  reason: Scalars['String']['output'];
}

export interface InvalidLicenseToActivateDataType {
  __typename?: 'InvalidLicenseToActivateDataType';
  reason: Scalars['String']['output'];
}

export interface InvalidLicenseUpdateParamsDataType {
  __typename?: 'InvalidLicenseUpdateParamsDataType';
  reason: Scalars['String']['output'];
}

export interface InvalidOauthCallbackCodeDataType {
  __typename?: 'InvalidOauthCallbackCodeDataType';
  body: Scalars['String']['output'];
  status: Scalars['Int']['output'];
}

export interface InvalidOauthResponseDataType {
  __typename?: 'InvalidOauthResponseDataType';
  reason: Scalars['String']['output'];
}

export interface InvalidPasswordLengthDataType {
  __typename?: 'InvalidPasswordLengthDataType';
  max: Scalars['Int']['output'];
  min: Scalars['Int']['output'];
}

export interface InvalidRuntimeConfigTypeDataType {
  __typename?: 'InvalidRuntimeConfigTypeDataType';
  get: Scalars['String']['output'];
  key: Scalars['String']['output'];
  want: Scalars['String']['output'];
}

export interface InvalidSearchProviderRequestDataType {
  __typename?: 'InvalidSearchProviderRequestDataType';
  reason: Scalars['String']['output'];
  type: Scalars['String']['output'];
}

export interface MemberNotFoundInSpaceDataType {
  __typename?: 'MemberNotFoundInSpaceDataType';
  spaceId: Scalars['String']['output'];
}

export interface MentionUserDocAccessDeniedDataType {
  __typename?: 'MentionUserDocAccessDeniedDataType';
  docId: Scalars['String']['output'];
}

export interface MissingOauthQueryParameterDataType {
  __typename?: 'MissingOauthQueryParameterDataType';
  name: Scalars['String']['output'];
}

export interface NoMoreSeatDataType {
  __typename?: 'NoMoreSeatDataType';
  spaceId: Scalars['String']['output'];
}

export interface NotInSpaceDataType {
  __typename?: 'NotInSpaceDataType';
  spaceId: Scalars['String']['output'];
}

export interface QueryTooLongDataType {
  __typename?: 'QueryTooLongDataType';
  max: Scalars['Int']['output'];
}

export interface RuntimeConfigNotFoundDataType {
  __typename?: 'RuntimeConfigNotFoundDataType';
  key: Scalars['String']['output'];
}

export interface SameSubscriptionRecurringDataType {
  __typename?: 'SameSubscriptionRecurringDataType';
  recurring: Scalars['String']['output'];
}

export interface SpaceAccessDeniedDataType {
  __typename?: 'SpaceAccessDeniedDataType';
  spaceId: Scalars['String']['output'];
}

export interface SpaceNotFoundDataType {
  __typename?: 'SpaceNotFoundDataType';
  spaceId: Scalars['String']['output'];
}

export interface SpaceOwnerNotFoundDataType {
  __typename?: 'SpaceOwnerNotFoundDataType';
  spaceId: Scalars['String']['output'];
}

export interface SpaceShouldHaveOnlyOneOwnerDataType {
  __typename?: 'SpaceShouldHaveOnlyOneOwnerDataType';
  spaceId: Scalars['String']['output'];
}

export interface SubscriptionAlreadyExistsDataType {
  __typename?: 'SubscriptionAlreadyExistsDataType';
  plan: Scalars['String']['output'];
}

export interface SubscriptionNotExistsDataType {
  __typename?: 'SubscriptionNotExistsDataType';
  plan: Scalars['String']['output'];
}

export interface SubscriptionPlanNotFoundDataType {
  __typename?: 'SubscriptionPlanNotFoundDataType';
  plan: Scalars['String']['output'];
  recurring: Scalars['String']['output'];
}

export interface UnknownOauthProviderDataType {
  __typename?: 'UnknownOauthProviderDataType';
  name: Scalars['String']['output'];
}

export interface UnsupportedClientVersionDataType {
  __typename?: 'UnsupportedClientVersionDataType';
  clientVersion: Scalars['String']['output'];
  requiredVersion: Scalars['String']['output'];
}

export interface UnsupportedSubscriptionPlanDataType {
  __typename?: 'UnsupportedSubscriptionPlanDataType';
  plan: Scalars['String']['output'];
}

export interface ValidationErrorDataType {
  __typename?: 'ValidationErrorDataType';
  errors: Scalars['String']['output'];
}

export interface VersionRejectedDataType {
  __typename?: 'VersionRejectedDataType';
  serverVersion: Scalars['String']['output'];
  version: Scalars['String']['output'];
}

export interface WorkspacePermissionNotFoundDataType {
  __typename?: 'WorkspacePermissionNotFoundDataType';
  spaceId: Scalars['String']['output'];
}

export interface WrongSignInCredentialsDataType {
  __typename?: 'WrongSignInCredentialsDataType';
  email: Scalars['String']['output'];
}

export type ErrorDataUnion =
  | AlreadyInSpaceDataType
  | BlobNotFoundDataType
  | CopilotContextFileNotSupportedDataType
  | CopilotDocNotFoundDataType
  | CopilotFailedToAddWorkspaceFileEmbeddingDataType
  | CopilotFailedToMatchContextDataType
  | CopilotFailedToMatchGlobalContextDataType
  | CopilotFailedToModifyContextDataType
  | CopilotInvalidContextDataType
  | CopilotMessageNotFoundDataType
  | CopilotPromptNotFoundDataType
  | CopilotProviderNotSupportedDataType
  | CopilotProviderSideErrorDataType
  | DocActionDeniedDataType
  | DocHistoryNotFoundDataType
  | DocNotFoundDataType
  | DocUpdateBlockedDataType
  | ExpectToGrantDocUserRolesDataType
  | ExpectToRevokeDocUserRolesDataType
  | ExpectToUpdateDocUserRoleDataType
  | GraphqlBadRequestDataType
  | HttpRequestErrorDataType
  | InvalidAppConfigDataType
  | InvalidAppConfigInputDataType
  | InvalidEmailDataType
  | InvalidHistoryTimestampDataType
  | InvalidIndexerInputDataType
  | InvalidLicenseToActivateDataType
  | InvalidLicenseUpdateParamsDataType
  | InvalidOauthCallbackCodeDataType
  | InvalidOauthResponseDataType
  | InvalidPasswordLengthDataType
  | InvalidRuntimeConfigTypeDataType
  | InvalidSearchProviderRequestDataType
  | MemberNotFoundInSpaceDataType
  | MentionUserDocAccessDeniedDataType
  | MissingOauthQueryParameterDataType
  | NoMoreSeatDataType
  | NotInSpaceDataType
  | QueryTooLongDataType
  | RuntimeConfigNotFoundDataType
  | SameSubscriptionRecurringDataType
  | SpaceAccessDeniedDataType
  | SpaceNotFoundDataType
  | SpaceOwnerNotFoundDataType
  | SpaceShouldHaveOnlyOneOwnerDataType
  | SubscriptionAlreadyExistsDataType
  | SubscriptionNotExistsDataType
  | SubscriptionPlanNotFoundDataType
  | UnknownOauthProviderDataType
  | UnsupportedClientVersionDataType
  | UnsupportedSubscriptionPlanDataType
  | ValidationErrorDataType
  | VersionRejectedDataType
  | WorkspacePermissionNotFoundDataType
  | WrongSignInCredentialsDataType;

export enum ErrorNames {
  ACCESS_DENIED = 'ACCESS_DENIED',
  ACTION_FORBIDDEN = 'ACTION_FORBIDDEN',
  ACTION_FORBIDDEN_ON_NON_TEAM_WORKSPACE = 'ACTION_FORBIDDEN_ON_NON_TEAM_WORKSPACE',
  ALREADY_IN_SPACE = 'ALREADY_IN_SPACE',
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  BAD_REQUEST = 'BAD_REQUEST',
  BLOB_NOT_FOUND = 'BLOB_NOT_FOUND',
  BLOB_QUOTA_EXCEEDED = 'BLOB_QUOTA_EXCEEDED',
  CANNOT_DELETE_ACCOUNT_WITH_OWNED_TEAM_WORKSPACE = 'CANNOT_DELETE_ACCOUNT_WITH_OWNED_TEAM_WORKSPACE',
  CANNOT_DELETE_ALL_ADMIN_ACCOUNT = 'CANNOT_DELETE_ALL_ADMIN_ACCOUNT',
  CANNOT_DELETE_OWN_ACCOUNT = 'CANNOT_DELETE_OWN_ACCOUNT',
  CANT_UPDATE_ONETIME_PAYMENT_SUBSCRIPTION = 'CANT_UPDATE_ONETIME_PAYMENT_SUBSCRIPTION',
  CAN_NOT_BATCH_GRANT_DOC_OWNER_PERMISSIONS = 'CAN_NOT_BATCH_GRANT_DOC_OWNER_PERMISSIONS',
  CAN_NOT_REVOKE_YOURSELF = 'CAN_NOT_REVOKE_YOURSELF',
  CAPTCHA_VERIFICATION_FAILED = 'CAPTCHA_VERIFICATION_FAILED',
  COPILOT_ACTION_TAKEN = 'COPILOT_ACTION_TAKEN',
  COPILOT_CONTEXT_FILE_NOT_SUPPORTED = 'COPILOT_CONTEXT_FILE_NOT_SUPPORTED',
  COPILOT_DOCS_NOT_FOUND = 'COPILOT_DOCS_NOT_FOUND',
  COPILOT_DOC_NOT_FOUND = 'COPILOT_DOC_NOT_FOUND',
  COPILOT_EMBEDDING_DISABLED = 'COPILOT_EMBEDDING_DISABLED',
  COPILOT_EMBEDDING_UNAVAILABLE = 'COPILOT_EMBEDDING_UNAVAILABLE',
  COPILOT_FAILED_TO_ADD_WORKSPACE_FILE_EMBEDDING = 'COPILOT_FAILED_TO_ADD_WORKSPACE_FILE_EMBEDDING',
  COPILOT_FAILED_TO_CREATE_MESSAGE = 'COPILOT_FAILED_TO_CREATE_MESSAGE',
  COPILOT_FAILED_TO_GENERATE_TEXT = 'COPILOT_FAILED_TO_GENERATE_TEXT',
  COPILOT_FAILED_TO_MATCH_CONTEXT = 'COPILOT_FAILED_TO_MATCH_CONTEXT',
  COPILOT_FAILED_TO_MATCH_GLOBAL_CONTEXT = 'COPILOT_FAILED_TO_MATCH_GLOBAL_CONTEXT',
  COPILOT_FAILED_TO_MODIFY_CONTEXT = 'COPILOT_FAILED_TO_MODIFY_CONTEXT',
  COPILOT_INVALID_CONTEXT = 'COPILOT_INVALID_CONTEXT',
  COPILOT_MESSAGE_NOT_FOUND = 'COPILOT_MESSAGE_NOT_FOUND',
  COPILOT_PROMPT_INVALID = 'COPILOT_PROMPT_INVALID',
  COPILOT_PROMPT_NOT_FOUND = 'COPILOT_PROMPT_NOT_FOUND',
  COPILOT_PROVIDER_NOT_SUPPORTED = 'COPILOT_PROVIDER_NOT_SUPPORTED',
  COPILOT_PROVIDER_SIDE_ERROR = 'COPILOT_PROVIDER_SIDE_ERROR',
  COPILOT_QUOTA_EXCEEDED = 'COPILOT_QUOTA_EXCEEDED',
  COPILOT_SESSION_DELETED = 'COPILOT_SESSION_DELETED',
  COPILOT_SESSION_NOT_FOUND = 'COPILOT_SESSION_NOT_FOUND',
  COPILOT_TRANSCRIPTION_AUDIO_NOT_PROVIDED = 'COPILOT_TRANSCRIPTION_AUDIO_NOT_PROVIDED',
  COPILOT_TRANSCRIPTION_JOB_EXISTS = 'COPILOT_TRANSCRIPTION_JOB_EXISTS',
  COPILOT_TRANSCRIPTION_JOB_NOT_FOUND = 'COPILOT_TRANSCRIPTION_JOB_NOT_FOUND',
  CUSTOMER_PORTAL_CREATE_FAILED = 'CUSTOMER_PORTAL_CREATE_FAILED',
  DOC_ACTION_DENIED = 'DOC_ACTION_DENIED',
  DOC_DEFAULT_ROLE_CAN_NOT_BE_OWNER = 'DOC_DEFAULT_ROLE_CAN_NOT_BE_OWNER',
  DOC_HISTORY_NOT_FOUND = 'DOC_HISTORY_NOT_FOUND',
  DOC_IS_NOT_PUBLIC = 'DOC_IS_NOT_PUBLIC',
  DOC_NOT_FOUND = 'DOC_NOT_FOUND',
  DOC_UPDATE_BLOCKED = 'DOC_UPDATE_BLOCKED',
  EARLY_ACCESS_REQUIRED = 'EARLY_ACCESS_REQUIRED',
  EMAIL_ALREADY_USED = 'EMAIL_ALREADY_USED',
  EMAIL_SERVICE_NOT_CONFIGURED = 'EMAIL_SERVICE_NOT_CONFIGURED',
  EMAIL_TOKEN_NOT_FOUND = 'EMAIL_TOKEN_NOT_FOUND',
  EMAIL_VERIFICATION_REQUIRED = 'EMAIL_VERIFICATION_REQUIRED',
  EXPECT_TO_GRANT_DOC_USER_ROLES = 'EXPECT_TO_GRANT_DOC_USER_ROLES',
  EXPECT_TO_PUBLISH_DOC = 'EXPECT_TO_PUBLISH_DOC',
  EXPECT_TO_REVOKE_DOC_USER_ROLES = 'EXPECT_TO_REVOKE_DOC_USER_ROLES',
  EXPECT_TO_REVOKE_PUBLIC_DOC = 'EXPECT_TO_REVOKE_PUBLIC_DOC',
  EXPECT_TO_UPDATE_DOC_USER_ROLE = 'EXPECT_TO_UPDATE_DOC_USER_ROLE',
  FAILED_TO_CHECKOUT = 'FAILED_TO_CHECKOUT',
  FAILED_TO_SAVE_UPDATES = 'FAILED_TO_SAVE_UPDATES',
  FAILED_TO_UPSERT_SNAPSHOT = 'FAILED_TO_UPSERT_SNAPSHOT',
  GRAPHQL_BAD_REQUEST = 'GRAPHQL_BAD_REQUEST',
  HTTP_REQUEST_ERROR = 'HTTP_REQUEST_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_APP_CONFIG = 'INVALID_APP_CONFIG',
  INVALID_APP_CONFIG_INPUT = 'INVALID_APP_CONFIG_INPUT',
  INVALID_AUTH_STATE = 'INVALID_AUTH_STATE',
  INVALID_CHECKOUT_PARAMETERS = 'INVALID_CHECKOUT_PARAMETERS',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_EMAIL_TOKEN = 'INVALID_EMAIL_TOKEN',
  INVALID_HISTORY_TIMESTAMP = 'INVALID_HISTORY_TIMESTAMP',
  INVALID_INDEXER_INPUT = 'INVALID_INDEXER_INPUT',
  INVALID_INVITATION = 'INVALID_INVITATION',
  INVALID_LICENSE_SESSION_ID = 'INVALID_LICENSE_SESSION_ID',
  INVALID_LICENSE_TO_ACTIVATE = 'INVALID_LICENSE_TO_ACTIVATE',
  INVALID_LICENSE_UPDATE_PARAMS = 'INVALID_LICENSE_UPDATE_PARAMS',
  INVALID_OAUTH_CALLBACK_CODE = 'INVALID_OAUTH_CALLBACK_CODE',
  INVALID_OAUTH_CALLBACK_STATE = 'INVALID_OAUTH_CALLBACK_STATE',
  INVALID_OAUTH_RESPONSE = 'INVALID_OAUTH_RESPONSE',
  INVALID_PASSWORD_LENGTH = 'INVALID_PASSWORD_LENGTH',
  INVALID_RUNTIME_CONFIG_TYPE = 'INVALID_RUNTIME_CONFIG_TYPE',
  INVALID_SEARCH_PROVIDER_REQUEST = 'INVALID_SEARCH_PROVIDER_REQUEST',
  INVALID_SUBSCRIPTION_PARAMETERS = 'INVALID_SUBSCRIPTION_PARAMETERS',
  LICENSE_EXPIRED = 'LICENSE_EXPIRED',
  LICENSE_NOT_FOUND = 'LICENSE_NOT_FOUND',
  LICENSE_REVEALED = 'LICENSE_REVEALED',
  LINK_EXPIRED = 'LINK_EXPIRED',
  MAILER_SERVICE_IS_NOT_CONFIGURED = 'MAILER_SERVICE_IS_NOT_CONFIGURED',
  MEMBER_NOT_FOUND_IN_SPACE = 'MEMBER_NOT_FOUND_IN_SPACE',
  MEMBER_QUOTA_EXCEEDED = 'MEMBER_QUOTA_EXCEEDED',
  MENTION_USER_DOC_ACCESS_DENIED = 'MENTION_USER_DOC_ACCESS_DENIED',
  MENTION_USER_ONESELF_DENIED = 'MENTION_USER_ONESELF_DENIED',
  MISSING_OAUTH_QUERY_PARAMETER = 'MISSING_OAUTH_QUERY_PARAMETER',
  NETWORK_ERROR = 'NETWORK_ERROR',
  NEW_OWNER_IS_NOT_ACTIVE_MEMBER = 'NEW_OWNER_IS_NOT_ACTIVE_MEMBER',
  NOTIFICATION_NOT_FOUND = 'NOTIFICATION_NOT_FOUND',
  NOT_FOUND = 'NOT_FOUND',
  NOT_IN_SPACE = 'NOT_IN_SPACE',
  NO_COPILOT_PROVIDER_AVAILABLE = 'NO_COPILOT_PROVIDER_AVAILABLE',
  NO_MORE_SEAT = 'NO_MORE_SEAT',
  OAUTH_ACCOUNT_ALREADY_CONNECTED = 'OAUTH_ACCOUNT_ALREADY_CONNECTED',
  OAUTH_STATE_EXPIRED = 'OAUTH_STATE_EXPIRED',
  OWNER_CAN_NOT_LEAVE_WORKSPACE = 'OWNER_CAN_NOT_LEAVE_WORKSPACE',
  PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',
  QUERY_TOO_LONG = 'QUERY_TOO_LONG',
  RUNTIME_CONFIG_NOT_FOUND = 'RUNTIME_CONFIG_NOT_FOUND',
  SAME_EMAIL_PROVIDED = 'SAME_EMAIL_PROVIDED',
  SAME_SUBSCRIPTION_RECURRING = 'SAME_SUBSCRIPTION_RECURRING',
  SEARCH_PROVIDER_NOT_FOUND = 'SEARCH_PROVIDER_NOT_FOUND',
  SIGN_UP_FORBIDDEN = 'SIGN_UP_FORBIDDEN',
  SPACE_ACCESS_DENIED = 'SPACE_ACCESS_DENIED',
  SPACE_NOT_FOUND = 'SPACE_NOT_FOUND',
  SPACE_OWNER_NOT_FOUND = 'SPACE_OWNER_NOT_FOUND',
  SPACE_SHOULD_HAVE_ONLY_ONE_OWNER = 'SPACE_SHOULD_HAVE_ONLY_ONE_OWNER',
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  SUBSCRIPTION_ALREADY_EXISTS = 'SUBSCRIPTION_ALREADY_EXISTS',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  SUBSCRIPTION_HAS_BEEN_CANCELED = 'SUBSCRIPTION_HAS_BEEN_CANCELED',
  SUBSCRIPTION_HAS_NOT_BEEN_CANCELED = 'SUBSCRIPTION_HAS_NOT_BEEN_CANCELED',
  SUBSCRIPTION_NOT_EXISTS = 'SUBSCRIPTION_NOT_EXISTS',
  SUBSCRIPTION_PLAN_NOT_FOUND = 'SUBSCRIPTION_PLAN_NOT_FOUND',
  TOO_MANY_REQUEST = 'TOO_MANY_REQUEST',
  UNKNOWN_OAUTH_PROVIDER = 'UNKNOWN_OAUTH_PROVIDER',
  UNSPLASH_IS_NOT_CONFIGURED = 'UNSPLASH_IS_NOT_CONFIGURED',
  UNSUPPORTED_CLIENT_VERSION = 'UNSUPPORTED_CLIENT_VERSION',
  UNSUPPORTED_SUBSCRIPTION_PLAN = 'UNSUPPORTED_SUBSCRIPTION_PLAN',
  USER_AVATAR_NOT_FOUND = 'USER_AVATAR_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  VERSION_REJECTED = 'VERSION_REJECTED',
  WORKSPACE_ID_REQUIRED_FOR_TEAM_SUBSCRIPTION = 'WORKSPACE_ID_REQUIRED_FOR_TEAM_SUBSCRIPTION',
  WORKSPACE_ID_REQUIRED_TO_UPDATE_TEAM_SUBSCRIPTION = 'WORKSPACE_ID_REQUIRED_TO_UPDATE_TEAM_SUBSCRIPTION',
  WORKSPACE_LICENSE_ALREADY_EXISTS = 'WORKSPACE_LICENSE_ALREADY_EXISTS',
  WORKSPACE_PERMISSION_NOT_FOUND = 'WORKSPACE_PERMISSION_NOT_FOUND',
  WRONG_SIGN_IN_CREDENTIALS = 'WRONG_SIGN_IN_CREDENTIALS',
  WRONG_SIGN_IN_METHOD = 'WRONG_SIGN_IN_METHOD',
}

// Copilot related types that might be shared or used by UserType's copilot field indirectly.
// For now, Copilot is an empty interface. If specific shared copilot types are needed, they can be added here.
// Example:
// export interface CopilotSessionType { ... }
// export interface CopilotQuota { ... }
// Then Copilot interface would be:
// export interface Copilot {
//   __typename?: 'Copilot';
//   quota: CopilotQuota;
//   session: CopilotSessionType;
//   // ... other fields
// }
// For now, keeping it simple as the main task is admin operations.
// The full Copilot type definition is large and might be better in its own file if shared across many domains.
// However, UserType.copilot is referenced, so a placeholder is needed.
// The fields UserTypeCopilotArgs and the actual fields of Copilot are not included here to keep shared-types focused.
// These will be handled when admin-types.ts or a dedicated copilot-types.ts is created.

export interface UserTypeCopilotArgs {
  workspaceId?: InputMaybe<Scalars['String']['input']>;
}

export interface UserTypeInvoicesArgs {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}

export interface PaginationInput {
  /** returns the elements in the list that come after the specified cursor. */
  after?: InputMaybe<Scalars['String']['input']>;
  /** returns the first n elements from the list. */
  first?: InputMaybe<Scalars['Int']['input']>;
  /** ignore the first n elements from the list. */
  offset?: InputMaybe<Scalars['Int']['input']>;
}

export interface UserTypeNotificationsArgs {
  pagination: PaginationInput;
}

// Placeholder for Copilot type as used in UserType
// The actual detailed Copilot type might be extensive and better suited for admin-types.ts or a dedicated copilot-types.ts
// For shared-types.ts, we only need to ensure UserType is valid.
// export interface Copilot {
//   __typename?: 'Copilot';
//   // Fields will be added if they are truly shared or when UserType's dependencies are fully resolved.
//   // For now, this is kept minimal.
//   [key: string]: any; // Basic placeholder
// }

// NOTE: The full definition of `Copilot` and its related types like `CopilotQuota`, `CopilotSessionType`,
// `CopilotContext`, etc., are extensive.
// Given the current task focuses on 'admin' operations and `shared-types.ts` is for widely shared types,
// I'm keeping the `Copilot` interface as a placeholder here.
// The detailed fields of `Copilot` as returned by `UserType.copilot` query will be part of `admin-types.ts`
// or a more specific `copilot-types.ts` if that level of granularity is decided later.
// This prevents `shared-types.ts` from becoming overly large with domain-specific details not universally shared.
// The `UserType` definition above uses `Copilot {}` which satisfies the structural requirement for now.
