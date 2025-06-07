import type {
  AddContextCategoryMutationVariables,
  AddContextCategoryMutation,
  RemoveContextCategoryMutationVariables,
  RemoveContextCategoryMutation,
  CreateCopilotContextMutationVariables,
  CreateCopilotContextMutation,
  AddContextDocMutationVariables,
  AddContextDocMutation,
  RemoveContextDocMutationVariables,
  RemoveContextDocMutation,
  AddContextFileMutationVariables,
  AddContextFileMutation,
  RemoveContextFileMutationVariables,
  RemoveContextFileMutation,
  ListContextObjectQueryVariables,
  ListContextObjectQuery,
  ListContextQueryVariables,
  ListContextQuery,
  MatchContextQueryVariables,
  MatchContextQuery,
  MatchWorkspaceDocsQueryVariables,
  MatchWorkspaceDocsQuery,
  MatchFilesQueryVariables,
  MatchFilesQuery,
  GetWorkspaceEmbeddingStatusQueryVariables,
  GetWorkspaceEmbeddingStatusQuery,
  QueueWorkspaceEmbeddingMutationVariables,
  QueueWorkspaceEmbeddingMutation,
  GetCopilotHistoryIdsQueryVariables,
  GetCopilotHistoryIdsQuery,
  GetCopilotHistoriesQueryVariables,
  GetCopilotHistoriesQuery,
  SubmitAudioTranscriptionMutationVariables,
  SubmitAudioTranscriptionMutation,
  ClaimAudioTranscriptionMutationVariables,
  ClaimAudioTranscriptionMutation,
  GetAudioTranscriptionQueryVariables,
  GetAudioTranscriptionQuery,
  RetryAudioTranscriptionMutationVariables,
  RetryAudioTranscriptionMutation,
  CreateCopilotMessageMutationVariables,
  CreateCopilotMessageMutation,
  CopilotQuotaQueryVariables,
  CopilotQuotaQuery,
  CleanupCopilotSessionMutationVariables,
  CleanupCopilotSessionMutation,
  CreateCopilotSessionMutationVariables,
  CreateCopilotSessionMutation,
  ForkCopilotSessionMutationVariables,
  ForkCopilotSessionMutation,
  GetCopilotSessionQueryVariables,
  GetCopilotSessionQuery,
  UpdateCopilotSessionMutationVariables,
  UpdateCopilotSessionMutation,
  GetCopilotSessionsQueryVariables,
  GetCopilotSessionsQuery,
  AddWorkspaceEmbeddingFilesMutationVariables,
  AddWorkspaceEmbeddingFilesMutation,
  GetWorkspaceEmbeddingFilesQueryVariables,
  GetWorkspaceEmbeddingFilesQuery,
  RemoveWorkspaceEmbeddingFilesMutationVariables,
  RemoveWorkspaceEmbeddingFilesMutation,
  AddWorkspaceEmbeddingIgnoredDocsMutationVariables,
  AddWorkspaceEmbeddingIgnoredDocsMutation,
  GetAllWorkspaceEmbeddingIgnoredDocsQueryVariables,
  GetAllWorkspaceEmbeddingIgnoredDocsQuery,
  GetWorkspaceEmbeddingIgnoredDocsQueryVariables,
  GetWorkspaceEmbeddingIgnoredDocsQuery,
  RemoveWorkspaceEmbeddingIgnoredDocsMutationVariables,
  RemoveWorkspaceEmbeddingIgnoredDocsMutation,
} from '../types/copilot-types';

export const copilotContextCategoryAdd = {
  id: 'copilot_context_category_add' as const,
  variablesType: null as unknown as AddContextCategoryMutationVariables,
  responseType: null as unknown as AddContextCategoryMutation,
};

export const copilotContextCategoryRemove = {
  id: 'copilot_context_category_remove' as const,
  variablesType: null as unknown as RemoveContextCategoryMutationVariables,
  responseType: null as unknown as RemoveContextCategoryMutation,
};

export const copilotContextCreate = {
  id: 'copilot_context_create' as const,
  variablesType: null as unknown as CreateCopilotContextMutationVariables,
  responseType: null as unknown as CreateCopilotContextMutation,
};

export const copilotContextDocAdd = {
  id: 'copilot_context_doc_add' as const,
  variablesType: null as unknown as AddContextDocMutationVariables,
  responseType: null as unknown as AddContextDocMutation,
};

export const copilotContextDocRemove = {
  id: 'copilot_context_doc_remove' as const,
  variablesType: null as unknown as RemoveContextDocMutationVariables,
  responseType: null as unknown as RemoveContextDocMutation,
};

export const copilotContextFileAdd = {
  id: 'copilot_context_file_add' as const,
  variablesType: null as unknown as AddContextFileMutationVariables,
  responseType: null as unknown as AddContextFileMutation,
};

export const copilotContextFileRemove = {
  id: 'copilot_context_file_remove' as const,
  variablesType: null as unknown as RemoveContextFileMutationVariables,
  responseType: null as unknown as RemoveContextFileMutation,
};

export const copilotContextListObject = {
  id: 'copilot_context_list_object' as const,
  variablesType: null as unknown as ListContextObjectQueryVariables,
  responseType: null as unknown as ListContextObjectQuery,
};

export const copilotContextList = {
  id: 'copilot_context_list' as const,
  variablesType: null as unknown as ListContextQueryVariables,
  responseType: null as unknown as ListContextQuery,
};

export const copilotContextMatchAll = {
  id: 'copilot_context_match_all' as const,
  variablesType: null as unknown as MatchContextQueryVariables,
  responseType: null as unknown as MatchContextQuery,
};

export const copilotContextMatchDocs = {
  id: 'copilot_context_match_docs' as const,
  variablesType: null as unknown as MatchWorkspaceDocsQueryVariables,
  responseType: null as unknown as MatchWorkspaceDocsQuery,
};

export const copilotContextMatchFiles = {
  id: 'copilot_context_match_files' as const,
  variablesType: null as unknown as MatchFilesQueryVariables,
  responseType: null as unknown as MatchFilesQuery,
};

export const copilotContextWorkspaceQuery = {
  id: 'copilot_context_workspace_query_status' as const, // Original GQL name: getWorkspaceEmbeddingStatus
  variablesType: null as unknown as GetWorkspaceEmbeddingStatusQueryVariables,
  responseType: null as unknown as GetWorkspaceEmbeddingStatusQuery,
};

export const copilotContextWorkspaceQueue = {
  id: 'copilot_context_workspace_queue_embedding' as const, // Original GQL name: queueWorkspaceEmbedding
  variablesType: null as unknown as QueueWorkspaceEmbeddingMutationVariables,
  responseType: null as unknown as QueueWorkspaceEmbeddingMutation,
};

export const copilotHistoryGetIds = {
  id: 'copilot_history_get_ids' as const,
  variablesType: null as unknown as GetCopilotHistoryIdsQueryVariables,
  responseType: null as unknown as GetCopilotHistoryIdsQuery,
};

export const copilotHistoryList = {
  id: 'copilot_history_list' as const,
  variablesType: null as unknown as GetCopilotHistoriesQueryVariables,
  responseType: null as unknown as GetCopilotHistoriesQuery,
};

export const copilotJobsTranscriptionAdd = {
  id: 'copilot_jobs_transcription_submit' as const, // Original GQL name: submitAudioTranscription
  variablesType: null as unknown as SubmitAudioTranscriptionMutationVariables,
  responseType: null as unknown as SubmitAudioTranscriptionMutation,
};

export const copilotJobsTranscriptionClaim = {
  id: 'copilot_jobs_transcription_claim' as const,
  variablesType: null as unknown as ClaimAudioTranscriptionMutationVariables,
  responseType: null as unknown as ClaimAudioTranscriptionMutation,
};

export const copilotJobsTranscriptionList = {
  id: 'copilot_jobs_transcription_get' as const, // Original GQL name: getAudioTranscription
  variablesType: null as unknown as GetAudioTranscriptionQueryVariables,
  responseType: null as unknown as GetAudioTranscriptionQuery,
};

export const copilotJobsTranscriptionRetry = {
  id: 'copilot_jobs_transcription_retry' as const,
  variablesType: null as unknown as RetryAudioTranscriptionMutationVariables,
  responseType: null as unknown as RetryAudioTranscriptionMutation,
};

export const copilotMessageCreate = {
  id: 'copilot_message_create' as const,
  variablesType: null as unknown as CreateCopilotMessageMutationVariables,
  responseType: null as unknown as CreateCopilotMessageMutation,
};

export const copilotQuota = {
  id: 'copilot_quota_get' as const, // Original GQL name: copilotQuota
  variablesType: null as unknown as CopilotQuotaQueryVariables,
  responseType: null as unknown as CopilotQuotaQuery,
};

export const copilotSessionCleanup = {
  id: 'copilot_session_cleanup' as const,
  variablesType: null as unknown as CleanupCopilotSessionMutationVariables,
  responseType: null as unknown as CleanupCopilotSessionMutation,
};

export const copilotSessionCreate = {
  id: 'copilot_session_create' as const,
  variablesType: null as unknown as CreateCopilotSessionMutationVariables,
  responseType: null as unknown as CreateCopilotSessionMutation,
};

export const copilotSessionFork = {
  id: 'copilot_session_fork' as const,
  variablesType: null as unknown as ForkCopilotSessionMutationVariables,
  responseType: null as unknown as ForkCopilotSessionMutation,
};

export const copilotSessionGet = {
  id: 'copilot_session_get' as const,
  variablesType: null as unknown as GetCopilotSessionQueryVariables,
  responseType: null as unknown as GetCopilotSessionQuery,
};

export const copilotSessionUpdate = {
  id: 'copilot_session_update' as const,
  variablesType: null as unknown as UpdateCopilotSessionMutationVariables,
  responseType: null as unknown as UpdateCopilotSessionMutation,
};

export const copilotSessionsGet = {
  id: 'copilot_sessions_get' as const,
  variablesType: null as unknown as GetCopilotSessionsQueryVariables,
  responseType: null as unknown as GetCopilotSessionsQuery,
};

export const copilotWorkspaceFileAdd = {
  id: 'copilot_workspace_file_add_embedding' as const, // Original GQL name: addWorkspaceEmbeddingFiles
  variablesType: null as unknown as AddWorkspaceEmbeddingFilesMutationVariables,
  responseType: null as unknown as AddWorkspaceEmbeddingFilesMutation,
};

export const copilotWorkspaceFileGet = {
  id: 'copilot_workspace_file_get_embeddings' as const, // Original GQL name: getWorkspaceEmbeddingFiles
  variablesType: null as unknown as GetWorkspaceEmbeddingFilesQueryVariables,
  responseType: null as unknown as GetWorkspaceEmbeddingFilesQuery,
};

export const copilotWorkspaceFileRemove = {
  id: 'copilot_workspace_file_remove_embedding' as const, // Original GQL name: removeWorkspaceEmbeddingFiles
  variablesType: null as unknown as RemoveWorkspaceEmbeddingFilesMutationVariables,
  responseType: null as unknown as RemoveWorkspaceEmbeddingFilesMutation,
};

export const copilotWorkspaceIgnoredDocsAdd = {
  id: 'copilot_workspace_ignored_docs_add_embedding' as const, // Original GQL name: addWorkspaceEmbeddingIgnoredDocs
  variablesType: null as unknown as AddWorkspaceEmbeddingIgnoredDocsMutationVariables,
  responseType: null as unknown as AddWorkspaceEmbeddingIgnoredDocsMutation,
};

export const copilotWorkspaceIgnoredDocsGetAll = {
  id: 'copilot_workspace_ignored_docs_get_all_embeddings' as const, // Original GQL name: getAllWorkspaceEmbeddingIgnoredDocs
  variablesType: null as unknown as GetAllWorkspaceEmbeddingIgnoredDocsQueryVariables,
  responseType: null as unknown as GetAllWorkspaceEmbeddingIgnoredDocsQuery,
};

export const copilotWorkspaceIgnoredDocsGet = {
  id: 'copilot_workspace_ignored_docs_get_embeddings' as const, // Original GQL name: getWorkspaceEmbeddingIgnoredDocs
  variablesType: null as unknown as GetWorkspaceEmbeddingIgnoredDocsQueryVariables,
  responseType: null as unknown as GetWorkspaceEmbeddingIgnoredDocsQuery,
};

export const copilotWorkspaceIgnoredDocsRemove = {
  id: 'copilot_workspace_ignored_docs_remove_embedding' as const, // Original GQL name: removeWorkspaceEmbeddingIgnoredDocs
  variablesType: null as unknown as RemoveWorkspaceEmbeddingIgnoredDocsMutationVariables,
  responseType: null as unknown as RemoveWorkspaceEmbeddingIgnoredDocsMutation,
};
