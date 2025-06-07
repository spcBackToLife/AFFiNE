import type {
  Scalars,
  Maybe,
  InputMaybe,
  Exact,
  PaginationInput,
  PageInfo,
  UserType, // For CopilotWorkspaceIgnoredDoc createdBy/updatedBy if it were PublicUserType
  PublicUserType, // For CopilotWorkspaceIgnoredDoc
  DocMode, // Copilot may deal with docs
} from './shared-types'; // Assuming UserType might be needed for some sub-fields if not PublicUserType

// Enum Types
export enum AiJobStatus {
  claimed = 'claimed',
  failed = 'failed',
  finished = 'finished',
  pending = 'pending',
  running = 'running',
}

export enum ChatHistoryOrder {
  asc = 'asc',
  desc = 'desc',
}

export enum ContextCategories {
  Collection = 'Collection',
  Tag = 'Tag',
}

export enum ContextEmbedStatus {
  failed = 'failed',
  finished = 'finished',
  processing = 'processing',
}

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

export enum CopilotPromptMessageRole {
  assistant = 'assistant',
  system = 'system',
  user = 'user',
}

// Input Object Types
export interface AddContextCategoryInput {
  categoryId: Scalars['String']['input'];
  contextId: Scalars['String']['input'];
  docs?: InputMaybe<Array<Scalars['String']['input']>>;
  type: ContextCategories;
}

export interface AddContextDocInput {
  contextId: Scalars['String']['input'];
  docId: Scalars['String']['input'];
}

export interface AddContextFileInput {
  blobId: Scalars['String']['input'];
  contextId: Scalars['String']['input'];
}

export interface CopilotPromptConfigInput {
  frequencyPenalty?: InputMaybe<Scalars['Float']['input']>;
  presencePenalty?: InputMaybe<Scalars['Float']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
  topP?: InputMaybe<Scalars['Float']['input']>;
}

export interface CopilotPromptMessageInput {
  content: Scalars['String']['input'];
  params?: InputMaybe<Scalars['JSON']['input']>;
  role: CopilotPromptMessageRole;
}

export interface CreateChatMessageInput {
  attachments?: InputMaybe<Array<Scalars['String']['input']>>;
  blobs?: InputMaybe<Array<Scalars['Upload']['input']>>; // Ensure Upload scalar is handled if not already
  content?: InputMaybe<Scalars['String']['input']>;
  params?: InputMaybe<Scalars['JSON']['input']>;
  sessionId: Scalars['String']['input'];
}

export interface CreateChatSessionInput {
  docId: Scalars['String']['input'];
  promptName: Scalars['String']['input'];
  workspaceId: Scalars['String']['input'];
}

export interface CreateCopilotPromptInput {
  action?: InputMaybe<Scalars['String']['input']>;
  config?: InputMaybe<CopilotPromptConfigInput>;
  messages: Array<CopilotPromptMessageInput>;
  model: CopilotModels;
  name: Scalars['String']['input'];
}

export interface DeleteSessionInput {
  docId: Scalars['String']['input'];
  sessionIds: Array<Scalars['String']['input']>;
  workspaceId: Scalars['String']['input'];
}

export interface ForkChatSessionInput {
  docId: Scalars['String']['input'];
  latestMessageId?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['String']['input'];
  workspaceId: Scalars['String']['input'];
}

export interface QueryChatHistoriesInput {
  action?: InputMaybe<Scalars['Boolean']['input']>;
  fork?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  messageOrder?: InputMaybe<ChatHistoryOrder>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  sessionOrder?: InputMaybe<ChatHistoryOrder>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  withPrompt?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface QueryChatSessionsInput {
  action?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface RemoveContextCategoryInput {
  categoryId: Scalars['String']['input'];
  contextId: Scalars['String']['input'];
  type: ContextCategories;
}

export interface RemoveContextDocInput {
  contextId: Scalars['String']['input'];
  docId: Scalars['String']['input'];
}

export interface RemoveContextFileInput {
  contextId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
}

export interface UpdateChatSessionInput {
  promptName: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
}

// Object Types
export interface ChatMessage {
  __typename?: 'ChatMessage';
  attachments: Maybe<Array<Scalars['String']['output']>>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Maybe<Scalars['ID']['output']>;
  params: Maybe<Scalars['JSON']['output']>;
  role: Scalars['String']['output'];
}

export interface ContextMatchedDocChunk {
  __typename?: 'ContextMatchedDocChunk';
  chunk: Scalars['SafeInt']['output'];
  content: Scalars['String']['output'];
  distance: Maybe<Scalars['Float']['output']>;
  docId: Scalars['String']['output'];
}

export interface ContextMatchedFileChunk {
  __typename?: 'ContextMatchedFileChunk';
  blobId: Scalars['String']['output'];
  chunk: Scalars['SafeInt']['output'];
  content: Scalars['String']['output'];
  distance: Maybe<Scalars['Float']['output']>;
  fileId: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  name: Scalars['String']['output'];
}

export interface ContextWorkspaceEmbeddingStatus {
  __typename?: 'ContextWorkspaceEmbeddingStatus';
  embedded: Scalars['SafeInt']['output'];
  total: Scalars['SafeInt']['output'];
}

export interface CopilotDocType {
  __typename?: 'CopilotDocType';
  createdAt: Scalars['SafeInt']['output'];
  id: Scalars['ID']['output'];
  status: Maybe<ContextEmbedStatus>;
}

export interface CopilotContextCategory {
  __typename?: 'CopilotContextCategory';
  createdAt: Scalars['SafeInt']['output'];
  docs: Array<CopilotDocType>;
  id: Scalars['ID']['output'];
  type: ContextCategories;
}

export interface CopilotContextDoc {
  __typename?: 'CopilotContextDoc';
  createdAt: Scalars['SafeInt']['output'];
  error: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: Maybe<ContextEmbedStatus>;
}

export interface CopilotContextFile {
  __typename?: 'CopilotContextFile';
  blobId: Scalars['String']['output'];
  chunkSize: Scalars['SafeInt']['output'];
  createdAt: Scalars['SafeInt']['output'];
  error: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: ContextEmbedStatus;
}

export interface CopilotContext {
  __typename?: 'CopilotContext';
  collections: Array<CopilotContextCategory>;
  docs: Array<CopilotContextDoc>;
  files: Array<CopilotContextFile>;
  id: Maybe<Scalars['ID']['output']>;
  matchFiles: Array<ContextMatchedFileChunk>;
  matchWorkspaceDocs: Array<ContextMatchedDocChunk>;
  tags: Array<CopilotContextCategory>;
  workspaceId: Scalars['String']['output'];
}

export interface CopilotHistories {
  __typename?: 'CopilotHistories';
  action: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  messages: Array<ChatMessage>;
  sessionId: Scalars['String']['output'];
  tokens: Scalars['Int']['output'];
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
  model: Scalars['String']['output']; // Corresponds to CopilotModels, but schema uses String
  name: Scalars['String']['output'];
}

export interface CopilotQuota {
  __typename?: 'CopilotQuota';
  limit: Maybe<Scalars['SafeInt']['output']>;
  used: Scalars['SafeInt']['output'];
}

export interface CopilotSessionType {
  __typename?: 'CopilotSessionType';
  id: Scalars['ID']['output'];
  model: Scalars['String']['output']; // Corresponds to CopilotModels
  optionalModels: Array<Scalars['String']['output']>; // Corresponds to CopilotModels[]
  parentSessionId: Maybe<Scalars['ID']['output']>;
  promptName: Scalars['String']['output'];
}

export interface CopilotWorkspaceFile {
  __typename?: 'CopilotWorkspaceFile';
  blobId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fileId: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  size: Scalars['SafeInt']['output'];
  workspaceId: Scalars['String']['output'];
}

export interface CopilotWorkspaceFileTypeEdge {
  __typename?: 'CopilotWorkspaceFileTypeEdge';
  cursor: Scalars['String']['output'];
  node: CopilotWorkspaceFile;
}

export interface PaginatedCopilotWorkspaceFileType {
  __typename?: 'PaginatedCopilotWorkspaceFileType';
  edges: Array<CopilotWorkspaceFileTypeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface CopilotWorkspaceIgnoredDoc {
  __typename?: 'CopilotWorkspaceIgnoredDoc';
  createdAt: Scalars['DateTime']['output'];
  createdBy: Maybe<Scalars['String']['output']>; // In schema, it's String, could be PublicUserType if resolved
  createdByAvatar: Maybe<Scalars['String']['output']>;
  docCreatedAt: Maybe<Scalars['DateTime']['output']>;
  docId: Scalars['String']['output'];
  docUpdatedAt: Maybe<Scalars['DateTime']['output']>;
  title: Maybe<Scalars['String']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>; // Similar to createdBy
}

export interface CopilotWorkspaceIgnoredDocTypeEdge {
  __typename?: 'CopilotWorkspaceIgnoredDocTypeEdge';
  cursor: Scalars['String']['output'];
  node: CopilotWorkspaceIgnoredDoc;
}

export interface PaginatedIgnoredDocsType {
  __typename?: 'PaginatedIgnoredDocsType';
  edges: Array<CopilotWorkspaceIgnoredDocTypeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface CopilotWorkspaceConfig {
  __typename?: 'CopilotWorkspaceConfig';
  allIgnoredDocs: Array<CopilotWorkspaceIgnoredDoc>;
  files: PaginatedCopilotWorkspaceFileType;
  ignoredDocs: PaginatedIgnoredDocsType;
  workspaceId: Scalars['String']['output'];
}

export interface TranscriptionItemType {
  __typename?: 'TranscriptionItemType';
  end: Scalars['String']['output'];
  speaker: Scalars['String']['output'];
  start: Scalars['String']['output'];
  transcription: Scalars['String']['output'];
}

export interface TranscriptionResultType {
  __typename?: 'TranscriptionResultType';
  actions: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: AiJobStatus;
  summary: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
  transcription: Maybe<Array<TranscriptionItemType>>;
}

// The main Copilot type, intended for UserType.copilot
export interface Copilot {
  __typename?: 'Copilot';
  audioTranscription: Maybe<TranscriptionResultType>;
  contexts: Array<CopilotContext>; // Uses CopilotContextArgs in schema
  histories: Array<CopilotHistories>; // Uses CopilotHistoriesArgs in schema
  quota: CopilotQuota;
  session: CopilotSessionType; // Uses CopilotSessionArgs in schema
  sessionIds: Array<Scalars['String']['output']>; // Uses CopilotSessionIdsArgs in schema
  sessions: Array<CopilotSessionType>; // Uses CopilotSessionsArgs in schema
  workspaceId: Maybe<Scalars['ID']['output']>;
}

// Args types for fields within Copilot type (if needed, though operations usually define these at top level)
export interface CopilotAudioTranscriptionArgs {
  blobId?: InputMaybe<Scalars['String']['input']>;
  jobId?: InputMaybe<Scalars['String']['input']>;
}

export interface CopilotContextsArgs {
  contextId?: InputMaybe<Scalars['String']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
}

export interface CopilotHistoriesArgs {
  docId?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QueryChatHistoriesInput>;
}

export interface CopilotSessionArgs {
  sessionId: Scalars['String']['input'];
}

export interface CopilotSessionIdsArgs {
  docId?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QueryChatSessionsInput>;
}

export interface CopilotSessionsArgs {
  docId?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QueryChatSessionsInput>;
}

// Mutation and Query response types specific to Copilot operations
// These will be imported by copilot.ts

export type AddContextCategoryMutationVariables = Exact<{
  options: AddContextCategoryInput;
}>;

export type AddContextCategoryMutation = {
  __typename?: 'Mutation';
  addContextCategory: CopilotContextCategory;
};

export type RemoveContextCategoryMutationVariables = Exact<{
  options: RemoveContextCategoryInput;
}>;

export type RemoveContextCategoryMutation = {
  __typename?: 'Mutation';
  removeContextCategory: Scalars['Boolean']['output'];
};

export type CreateCopilotContextMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
}>;

export type CreateCopilotContextMutation = {
  __typename?: 'Mutation';
  createCopilotContext: Scalars['String']['output'];
};

export type AddContextDocMutationVariables = Exact<{
  options: AddContextDocInput;
}>;

export type AddContextDocMutation = {
  __typename?: 'Mutation';
  addContextDoc: CopilotContextDoc;
};

export type RemoveContextDocMutationVariables = Exact<{
  options: RemoveContextDocInput;
}>;

export type RemoveContextDocMutation = {
  __typename?: 'Mutation';
  removeContextDoc: Scalars['Boolean']['output'];
};

export type AddContextFileMutationVariables = Exact<{
  content: Scalars['Upload']['input'];
  options: AddContextFileInput;
}>;

export type AddContextFileMutation = {
  __typename?: 'Mutation';
  addContextFile: CopilotContextFile;
};

export type RemoveContextFileMutationVariables = Exact<{
  options: RemoveContextFileInput;
}>;

export type RemoveContextFileMutation = {
  __typename?: 'Mutation';
  removeContextFile: Scalars['Boolean']['output'];
};

export type ListContextObjectQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
  contextId: Scalars['String']['input'];
}>;

export type ListContextObjectQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      contexts: Array<CopilotContext>;
    };
  }>;
};

export type ListContextQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
}>;

export type ListContextQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      contexts: Array<{
        __typename?: 'CopilotContext';
        id: Maybe<Scalars['ID']['output']>;
        workspaceId: Scalars['String']['output'];
      }>;
    };
  }>;
};

export type MatchContextQueryVariables = Exact<{
  contextId?: InputMaybe<Scalars['String']['input']>;
  workspaceId?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['SafeInt']['input']>;
  scopedThreshold?: InputMaybe<Scalars['Float']['input']>;
  threshold?: InputMaybe<Scalars['Float']['input']>;
}>;

export type MatchContextQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      contexts: Array<CopilotContext>; // Schema shows matchFiles/matchWorkspaceDocs directly on CopilotContext
    };
  }>;
};

export type MatchWorkspaceDocsQueryVariables = Exact<{
  contextId?: InputMaybe<Scalars['String']['input']>; // These seem to be args for CopilotContext.matchWorkspaceDocs
  workspaceId?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['SafeInt']['input']>;
  scopedThreshold?: InputMaybe<Scalars['Float']['input']>;
  threshold?: InputMaybe<Scalars['Float']['input']>;
}>;

export type MatchWorkspaceDocsQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      contexts: Array<{ // The GQL query structure implies this path
        __typename?: 'CopilotContext';
        matchWorkspaceDocs: Array<ContextMatchedDocChunk>;
      }>;
    };
  }>;
};

export type MatchFilesQueryVariables = Exact<{
  contextId?: InputMaybe<Scalars['String']['input']>; // Args for CopilotContext.matchFiles
  workspaceId?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['SafeInt']['input']>;
  scopedThreshold?: InputMaybe<Scalars['Float']['input']>;
  threshold?: InputMaybe<Scalars['Float']['input']>;
}>;

export type MatchFilesQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      contexts: Array<{ // The GQL query structure implies this path
        __typename?: 'CopilotContext';
        matchFiles: Array<ContextMatchedFileChunk>;
      }>;
    };
  }>;
};


export type GetWorkspaceEmbeddingStatusQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
}>;

export type GetWorkspaceEmbeddingStatusQuery = {
  __typename?: 'Query';
  queryWorkspaceEmbeddingStatus: ContextWorkspaceEmbeddingStatus;
};

export type QueueWorkspaceEmbeddingMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  docId: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type QueueWorkspaceEmbeddingMutation = {
  __typename?: 'Mutation';
  queueWorkspaceEmbedding: Scalars['Boolean']['output'];
};

export type GetCopilotHistoryIdsQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  docId?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QueryChatHistoriesInput>;
}>;

export type GetCopilotHistoryIdsQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      histories: Array<{
        __typename?: 'CopilotHistories';
        sessionId: Scalars['String']['output'];
        messages: Array<{
          __typename?: 'ChatMessage';
          id: Maybe<Scalars['ID']['output']>;
          role: Scalars['String']['output'];
          createdAt: Scalars['DateTime']['output'];
        }>;
      }>;
    };
  }>;
};

export type GetCopilotHistoriesQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  docId?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QueryChatHistoriesInput>;
}>;

export type GetCopilotHistoriesQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      histories: Array<CopilotHistories>;
    };
  }>;
};

export type SubmitAudioTranscriptionMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  blobId: Scalars['String']['input'];
  blob?: InputMaybe<Scalars['Upload']['input']>;
  blobs?: InputMaybe<Array<Scalars['Upload']['input']> | Scalars['Upload']['input']>;
}>;

export type SubmitAudioTranscriptionMutation = {
  __typename?: 'Mutation';
  submitAudioTranscription: Maybe<TranscriptionResultType>;
};

export type ClaimAudioTranscriptionMutationVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;

export type ClaimAudioTranscriptionMutation = {
  __typename?: 'Mutation';
  claimAudioTranscription: Maybe<TranscriptionResultType>;
};

export type GetAudioTranscriptionQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  jobId?: InputMaybe<Scalars['String']['input']>;
  blobId?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetAudioTranscriptionQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      audioTranscription: Maybe<TranscriptionResultType>;
    };
  }>;
};

export type RetryAudioTranscriptionMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  jobId: Scalars['String']['input'];
}>;

export type RetryAudioTranscriptionMutation = {
  __typename?: 'Mutation';
  retryAudioTranscription: Maybe<TranscriptionResultType>;
};

export type CreateCopilotMessageMutationVariables = Exact<{
  options: CreateChatMessageInput;
}>;

export type CreateCopilotMessageMutation = {
  __typename?: 'Mutation';
  createCopilotMessage: Scalars['String']['output'];
};

export type CopilotQuotaQueryVariables = Exact<{ [key: string]: never }>;

export type CopilotQuotaQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      quota: CopilotQuota;
    };
  }>;
};

export type CleanupCopilotSessionMutationVariables = Exact<{
  input: DeleteSessionInput; // Renamed from options to input for consistency
}>;

export type CleanupCopilotSessionMutation = {
  __typename?: 'Mutation';
  cleanupCopilotSession: Array<Scalars['String']['output']>;
};

export type CreateCopilotSessionMutationVariables = Exact<{
  options: CreateChatSessionInput;
}>;

export type CreateCopilotSessionMutation = {
  __typename?: 'Mutation';
  createCopilotSession: Scalars['String']['output'];
};

export type ForkCopilotSessionMutationVariables = Exact<{
  options: ForkChatSessionInput;
}>;

export type ForkCopilotSessionMutation = {
  __typename?: 'Mutation';
  forkCopilotSession: Scalars['String']['output'];
};

export type GetCopilotSessionQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
}>;

export type GetCopilotSessionQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      session: CopilotSessionType;
    };
  }>;
};

export type UpdateCopilotSessionMutationVariables = Exact<{
  options: UpdateChatSessionInput;
}>;

export type UpdateCopilotSessionMutation = {
  __typename?: 'Mutation';
  updateCopilotSession: Scalars['String']['output'];
};

export type GetCopilotSessionsQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  docId?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QueryChatSessionsInput>;
}>;

export type GetCopilotSessionsQuery = {
  __typename?: 'Query';
  currentUser: Maybe<{
    __typename?: 'UserType';
    copilot: {
      __typename?: 'Copilot';
      sessions: Array<CopilotSessionType>;
    };
  }>;
};

export type AddWorkspaceEmbeddingFilesMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  blob: Scalars['Upload']['input'];
}>;

export type AddWorkspaceEmbeddingFilesMutation = {
  __typename?: 'Mutation';
  addWorkspaceEmbeddingFiles: CopilotWorkspaceFile;
};

export type GetWorkspaceEmbeddingFilesQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  pagination: PaginationInput;
}>;

export type GetWorkspaceEmbeddingFilesQuery = {
  __typename?: 'Query';
  workspace: { // This query is on WorkspaceType, not UserType.copilot
    __typename?: 'WorkspaceType';
    embedding: CopilotWorkspaceConfig;
  };
};

export type RemoveWorkspaceEmbeddingFilesMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
}>;

export type RemoveWorkspaceEmbeddingFilesMutation = {
  __typename?: 'Mutation';
  removeWorkspaceEmbeddingFiles: Scalars['Boolean']['output'];
};

export type AddWorkspaceEmbeddingIgnoredDocsMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  add: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type AddWorkspaceEmbeddingIgnoredDocsMutation = {
  __typename?: 'Mutation';
  updateWorkspaceEmbeddingIgnoredDocs: Scalars['Int']['output'];
};

export type GetAllWorkspaceEmbeddingIgnoredDocsQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
}>;

export type GetAllWorkspaceEmbeddingIgnoredDocsQuery = {
  __typename?: 'Query';
  workspace: { // This query is on WorkspaceType
    __typename?: 'WorkspaceType';
    embedding: CopilotWorkspaceConfig; // Specifically, allIgnoredDocs field
  };
};

export type GetWorkspaceEmbeddingIgnoredDocsQueryVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  pagination: PaginationInput;
}>;

export type GetWorkspaceEmbeddingIgnoredDocsQuery = {
  __typename?: 'Query';
  workspace: { // This query is on WorkspaceType
    __typename?: 'WorkspaceType';
    embedding: CopilotWorkspaceConfig; // Specifically, ignoredDocs field
  };
};

export type RemoveWorkspaceEmbeddingIgnoredDocsMutationVariables = Exact<{
  workspaceId: Scalars['String']['input'];
  remove: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type RemoveWorkspaceEmbeddingIgnoredDocsMutation = {
  __typename?: 'Mutation';
  updateWorkspaceEmbeddingIgnoredDocs: Scalars['Int']['output'];
};

// Forward declare WorkspaceType if it's used by Copilot types and defined elsewhere.
// For GetWorkspaceEmbeddingFilesQuery etc., it would be imported.
// For now, assuming WorkspaceType is available or will be defined in its own file.
interface WorkspaceType {
  __typename?: 'WorkspaceType';
  embedding: CopilotWorkspaceConfig;
}
