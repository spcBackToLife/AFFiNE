-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Enum Types
CREATE TYPE "WorkspaceMemberStatus" AS ENUM (
  'Pending',
  'UnderReview',
  'AllocatingSeat',
  'NeedMoreSeat',
  'Accepted',
  'NeedMoreSeatAndReview'
);

CREATE TYPE "WorkspaceMemberSource" AS ENUM (
  'Email',
  'Link'
);

CREATE TYPE "AiPromptRole" AS ENUM (
  'system',
  'assistant',
  'user'
);

CREATE TYPE "AiJobStatus" AS ENUM (
  'pending',
  'running',
  'finished',
  'claimed',
  'failed'
);

CREATE TYPE "AiJobType" AS ENUM (
  'transcription'
);

CREATE TYPE "RuntimeConfigType" AS ENUM (
  'String',
  'Number',
  'Boolean',
  'Object',
  'Array'
);

CREATE TYPE "NotificationType" AS ENUM (
  'Mention',
  'Invitation',
  'InvitationAccepted',
  'InvitationBlocked',
  'InvitationRejected',
  'InvitationReviewRequest',
  'InvitationReviewApproved',
  'InvitationReviewDeclined'
);

CREATE TYPE "NotificationLevel" AS ENUM (
  'High',
  'Default',
  'Low',
  'Min',
  'None'
);

-- Table Definitions

CREATE TABLE "users" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR NOT NULL,
  "email" VARCHAR UNIQUE NOT NULL,
  "email_verified" TIMESTAMPTZ(3),
  "avatar_url" VARCHAR,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "password" VARCHAR,
  "registered" BOOLEAN NOT NULL DEFAULT true,
  "disabled" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "user_connected_accounts" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" VARCHAR NOT NULL,
  "provider" VARCHAR NOT NULL,
  "provider_account_id" VARCHAR NOT NULL,
  "scope" TEXT,
  "access_token" TEXT,
  "refresh_token" TEXT,
  "expires_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL -- Prisma @updatedAt
);

CREATE TABLE "multiple_users_sessions" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "expires_at" TIMESTAMPTZ(3) -- deprecated_expiresAt
);

CREATE TABLE "user_sessions" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" VARCHAR NOT NULL,
  "user_id" VARCHAR NOT NULL,
  "expires_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now()
);

CREATE TABLE "verification_tokens" (
  "token" VARCHAR NOT NULL,
  "type" SMALLINT NOT NULL,
  "credential" TEXT,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL
);

CREATE TABLE "workspaces" (
  "sid" SERIAL UNIQUE,
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "public" BOOLEAN NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "enable_ai" BOOLEAN NOT NULL DEFAULT true,
  "enable_url_preview" BOOLEAN NOT NULL DEFAULT false,
  "enable_doc_embedding" BOOLEAN NOT NULL DEFAULT true,
  "name" VARCHAR,
  "avatar_key" VARCHAR,
  "indexed" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "workspace_pages" (
  "workspace_id" VARCHAR NOT NULL,
  "page_id" VARCHAR NOT NULL,
  "public" BOOLEAN NOT NULL DEFAULT false,
  "defaultRole" SMALLINT NOT NULL DEFAULT 30,
  "mode" SMALLINT NOT NULL DEFAULT 0,
  "blocked" BOOLEAN NOT NULL DEFAULT false,
  "title" VARCHAR,
  "summary" VARCHAR,
  PRIMARY KEY ("workspace_id", "page_id")
);

CREATE TABLE "workspace_user_permissions" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" VARCHAR NOT NULL,
  "user_id" VARCHAR NOT NULL,
  "type" SMALLINT NOT NULL,
  "status" "WorkspaceMemberStatus" NOT NULL DEFAULT 'Pending',
  "source" "WorkspaceMemberSource" NOT NULL DEFAULT 'Email',
  "inviter_id" VARCHAR,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(), -- Prisma @default(now()) @updatedAt
  "accepted" BOOLEAN NOT NULL DEFAULT false -- deprecated
);

CREATE TABLE "workspace_page_user_permissions" (
  "workspace_id" VARCHAR NOT NULL,
  "page_id" VARCHAR NOT NULL,
  "user_id" VARCHAR NOT NULL,
  "type" SMALLINT NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  PRIMARY KEY ("workspace_id", "page_id", "user_id")
);

CREATE TABLE "features" (
  "id" SERIAL PRIMARY KEY,
  "feature" VARCHAR NOT NULL,
  "configs" JSON NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(), -- Prisma @default(now()) @updatedAt
  "version" INTEGER NOT NULL DEFAULT 0, -- deprecatedVersion
  "type" INTEGER NOT NULL DEFAULT 0 -- deprecatedType
);

CREATE TABLE "user_features" (
  "id" SERIAL PRIMARY KEY,
  "user_id" VARCHAR NOT NULL,
  "feature_id" INTEGER NOT NULL,
  "name" VARCHAR NOT NULL DEFAULT '',
  "type" INTEGER NOT NULL DEFAULT 0,
  "reason" VARCHAR NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "expired_at" TIMESTAMPTZ(3),
  "activated" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "workspace_features" (
  "id" SERIAL PRIMARY KEY,
  "workspace_id" VARCHAR NOT NULL,
  "feature_id" INTEGER NOT NULL,
  "name" VARCHAR NOT NULL DEFAULT '',
  "type" INTEGER NOT NULL DEFAULT 0,
  "configs" JSON NOT NULL DEFAULT '{}',
  "reason" VARCHAR NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "activated" BOOLEAN NOT NULL DEFAULT false,
  "expired_at" TIMESTAMPTZ(3)
);

CREATE TABLE "snapshots" (
  "workspace_id" VARCHAR NOT NULL,
  "guid" VARCHAR NOT NULL DEFAULT gen_random_uuid(), -- id
  "blob" BYTEA NOT NULL,
  "state" BYTEA,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL, -- No @updatedAt or @default(now()) in schema
  "created_by" VARCHAR,
  "updated_by" VARCHAR,
  "seq" INTEGER DEFAULT 0, -- deprecated
  PRIMARY KEY ("workspace_id", "guid")
);

CREATE TABLE "user_snapshots" (
  "user_id" VARCHAR NOT NULL,
  "id" VARCHAR NOT NULL,
  "blob" BYTEA NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL, -- Prisma @updatedAt
  PRIMARY KEY ("user_id", "id")
);

CREATE TABLE "updates" (
  "workspace_id" VARCHAR NOT NULL,
  "guid" VARCHAR NOT NULL, -- id
  "blob" BYTEA NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "created_by" VARCHAR,
  "seq" INTEGER, -- deprecated
  PRIMARY KEY ("workspace_id", "guid", "created_at")
);

CREATE TABLE "snapshot_histories" (
  "workspace_id" VARCHAR NOT NULL,
  "guid" VARCHAR NOT NULL, -- id
  "timestamp" TIMESTAMPTZ(3) NOT NULL,
  "blob" BYTEA NOT NULL,
  "state" BYTEA,
  "expired_at" TIMESTAMPTZ(3) NOT NULL,
  "created_by" VARCHAR,
  PRIMARY KEY ("workspace_id", "guid", "timestamp")
);

CREATE TABLE "ai_prompts_messages" (
  "prompt_id" INTEGER NOT NULL,
  "idx" INTEGER NOT NULL,
  "role" "AiPromptRole" NOT NULL,
  "content" TEXT NOT NULL,
  "attachments" JSON,
  "params" JSON,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now()
);

CREATE TABLE "ai_prompts_metadata" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(32) UNIQUE NOT NULL,
  "action" VARCHAR,
  "model" VARCHAR NOT NULL,
  "optional_models" VARCHAR[] NOT NULL DEFAULT '{}',
  "config" JSON,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(), -- Prisma @default(now()) @updatedAt
  "modified" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "ai_sessions_messages" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" VARCHAR NOT NULL,
  "role" "AiPromptRole" NOT NULL,
  "content" TEXT NOT NULL,
  "attachments" JSON,
  "params" JSON,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL -- Prisma @updatedAt
);

CREATE TABLE "ai_sessions_metadata" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" VARCHAR NOT NULL,
  "workspace_id" VARCHAR NOT NULL,
  "doc_id" VARCHAR NOT NULL,
  "prompt_name" VARCHAR(32) NOT NULL,
  "parent_session_id" VARCHAR,
  "messageCost" INTEGER NOT NULL DEFAULT 0,
  "tokenCost" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ(3)
);

CREATE TABLE "ai_contexts" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" VARCHAR NOT NULL,
  "config" JSON NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL -- Prisma @updatedAt
);

CREATE TABLE "ai_context_embeddings" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "context_id" VARCHAR NOT NULL,
  "file_id" VARCHAR NOT NULL,
  "chunk" INTEGER NOT NULL,
  "content" VARCHAR NOT NULL,
  "embedding" extensions.vector(1024),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL -- Prisma @updatedAt
);

CREATE TABLE "ai_workspace_embeddings" (
  "workspace_id" VARCHAR NOT NULL,
  "doc_id" VARCHAR NOT NULL,
  "chunk" INTEGER NOT NULL,
  "content" VARCHAR NOT NULL,
  "embedding" extensions.vector(1024),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL, -- Prisma @updatedAt
  PRIMARY KEY ("workspace_id", "doc_id", "chunk")
);

CREATE TABLE "ai_workspace_ignored_docs" (
  "workspace_id" VARCHAR NOT NULL,
  "doc_id" VARCHAR NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  PRIMARY KEY ("workspace_id", "doc_id")
);

CREATE TABLE "ai_workspace_files" (
  "workspace_id" VARCHAR NOT NULL,
  "file_id" VARCHAR NOT NULL,
  "blob_id" VARCHAR NOT NULL DEFAULT '',
  "file_name" VARCHAR NOT NULL,
  "mime_type" VARCHAR NOT NULL,
  "size" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  PRIMARY KEY ("workspace_id", "file_id")
);

CREATE TABLE "ai_workspace_file_embeddings" (
  "workspace_id" VARCHAR NOT NULL,
  "file_id" VARCHAR NOT NULL,
  "chunk" INTEGER NOT NULL,
  "content" VARCHAR NOT NULL,
  "embedding" extensions.vector(1024),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  PRIMARY KEY ("workspace_id", "file_id", "chunk")
);

CREATE TABLE "ai_jobs" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" VARCHAR NOT NULL,
  "blob_id" VARCHAR NOT NULL,
  "created_by" VARCHAR,
  "type" "AiJobType" NOT NULL,
  "status" "AiJobStatus" NOT NULL DEFAULT 'pending',
  "payload" JSON NOT NULL,
  "started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "finished_at" TIMESTAMPTZ(3)
);

CREATE TABLE "_data_migrations" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR UNIQUE NOT NULL,
  "started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "finished_at" TIMESTAMPTZ(3)
);

CREATE TABLE "app_runtime_settings" ( -- DeprecatedAppRuntimeSettings
  "id" VARCHAR PRIMARY KEY,
  "type" "RuntimeConfigType" NOT NULL,
  "module" VARCHAR NOT NULL,
  "key" VARCHAR NOT NULL,
  "value" JSON NOT NULL,
  "description" TEXT NOT NULL,
  "updated_at" TIMESTAMPTZ(3) NOT NULL, -- Prisma @updatedAt
  "deleted_at" TIMESTAMPTZ(3),
  "last_updated_by" VARCHAR
);

CREATE TABLE "app_configs" (
  "id" VARCHAR PRIMARY KEY,
  "value" JSONB NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL, -- Prisma @updatedAt
  "last_updated_by" VARCHAR
);

CREATE TABLE "user_subscriptions" ( -- DeprecatedUserSubscription
  "id" SERIAL PRIMARY KEY,
  "user_id" VARCHAR NOT NULL,
  "plan" VARCHAR(20) NOT NULL,
  "recurring" VARCHAR(20) NOT NULL,
  "variant" VARCHAR(20),
  "stripe_subscription_id" VARCHAR UNIQUE,
  "status" VARCHAR(20) NOT NULL,
  "start" TIMESTAMPTZ(3) NOT NULL,
  "end" TIMESTAMPTZ(3),
  "next_bill_at" TIMESTAMPTZ(3),
  "canceled_at" TIMESTAMPTZ(3),
  "trial_start" TIMESTAMPTZ(3),
  "trial_end" TIMESTAMPTZ(3),
  "stripe_schedule_id" VARCHAR,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL -- Prisma @updatedAt
);

CREATE TABLE "user_invoices" ( -- DeprecatedUserInvoice
  "id" SERIAL PRIMARY KEY,
  "user_id" VARCHAR NOT NULL,
  "stripe_invoice_id" VARCHAR UNIQUE NOT NULL,
  "currency" VARCHAR(3) NOT NULL,
  "amount" INTEGER NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL, -- Prisma @updatedAt
  "reason" VARCHAR,
  "last_payment_error" TEXT,
  "link" TEXT,
  "plan" VARCHAR(20), -- deprecated
  "recurring" VARCHAR(20) -- deprecated
);

CREATE TABLE "user_stripe_customers" (
  "user_id" VARCHAR PRIMARY KEY,
  "stripe_customer_id" VARCHAR UNIQUE NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now()
);

CREATE TABLE "subscriptions" (
  "id" SERIAL PRIMARY KEY,
  "target_id" VARCHAR NOT NULL,
  "plan" VARCHAR(20) NOT NULL,
  "recurring" VARCHAR(20) NOT NULL,
  "variant" VARCHAR(20),
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "stripe_subscription_id" VARCHAR UNIQUE,
  "stripe_schedule_id" VARCHAR,
  "status" VARCHAR(20) NOT NULL,
  "start" TIMESTAMPTZ(3) NOT NULL,
  "end" TIMESTAMPTZ(3),
  "next_bill_at" TIMESTAMPTZ(3),
  "canceled_at" TIMESTAMPTZ(3),
  "trial_start" TIMESTAMPTZ(3),
  "trial_end" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL -- Prisma @updatedAt
);

CREATE TABLE "invoices" (
  "stripe_invoice_id" VARCHAR PRIMARY KEY,
  "target_id" VARCHAR NOT NULL,
  "currency" VARCHAR(3) NOT NULL,
  "amount" INTEGER NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL, -- Prisma @updatedAt
  "reason" VARCHAR,
  "last_payment_error" TEXT,
  "link" TEXT,
  "onetime_subscription_redeemed" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "licenses" (
  "key" VARCHAR PRIMARY KEY,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "revealed_at" TIMESTAMPTZ(3),
  "installed_at" TIMESTAMPTZ(3),
  "validate_key" VARCHAR
);

CREATE TABLE "installed_licenses" (
  "key" VARCHAR PRIMARY KEY,
  "workspace_id" VARCHAR UNIQUE NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "recurring" VARCHAR NOT NULL,
  "variant" VARCHAR,
  "installed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "validate_key" VARCHAR NOT NULL,
  "validated_at" TIMESTAMPTZ(3) NOT NULL,
  "expired_at" TIMESTAMPTZ(3),
  "license" BYTEA
);

CREATE TABLE "blobs" (
  "workspace_id" VARCHAR NOT NULL,
  "key" VARCHAR NOT NULL,
  "size" INTEGER NOT NULL,
  "mime" VARCHAR NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ(3),
  PRIMARY KEY ("workspace_id", "key")
);

CREATE TABLE "notifications" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" VARCHAR NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(), -- Prisma @default(now()) @updatedAt
  "level" "NotificationLevel" NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "type" "NotificationType" NOT NULL,
  "body" JSONB NOT NULL
);

CREATE TABLE "user_settings" (
  "user_id" VARCHAR PRIMARY KEY,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL, -- Prisma @updatedAt
  "payload" JSONB NOT NULL
);

-- Foreign Key Constraints

ALTER TABLE "user_connected_accounts" ADD CONSTRAINT "user_connected_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "multiple_users_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_pages" ADD CONSTRAINT "workspace_pages_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_user_permissions" ADD CONSTRAINT "workspace_user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_user_permissions" ADD CONSTRAINT "workspace_user_permissions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_user_permissions" ADD CONSTRAINT "workspace_user_permissions_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "workspace_page_user_permissions" ADD CONSTRAINT "workspace_page_user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_page_user_permissions" ADD CONSTRAINT "workspace_page_user_permissions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_features" ADD CONSTRAINT "user_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_features" ADD CONSTRAINT "user_features_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_features" ADD CONSTRAINT "workspace_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_features" ADD CONSTRAINT "workspace_features_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
--ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE; -- As per schema comment
ALTER TABLE "user_snapshots" ADD CONSTRAINT "user_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "updates" ADD CONSTRAINT "updates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "snapshot_histories" ADD CONSTRAINT "snapshot_histories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_prompts_messages" ADD CONSTRAINT "ai_prompts_messages_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "ai_prompts_metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_sessions_messages" ADD CONSTRAINT "ai_sessions_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ai_sessions_metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_sessions_metadata" ADD CONSTRAINT "ai_sessions_metadata_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_sessions_metadata" ADD CONSTRAINT "ai_sessions_metadata_prompt_name_fkey" FOREIGN KEY ("prompt_name") REFERENCES "ai_prompts_metadata"("name") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_contexts" ADD CONSTRAINT "ai_contexts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ai_sessions_metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_context_embeddings" ADD CONSTRAINT "ai_context_embeddings_context_id_fkey" FOREIGN KEY ("context_id") REFERENCES "ai_contexts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_workspace_embeddings" ADD CONSTRAINT "ai_workspace_embeddings_workspace_id_doc_id_fkey" FOREIGN KEY ("workspace_id", "doc_id") REFERENCES "snapshots"("workspace_id", "guid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_workspace_ignored_docs" ADD CONSTRAINT "ai_workspace_ignored_docs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_workspace_files" ADD CONSTRAINT "ai_workspace_files_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_workspace_file_embeddings" ADD CONSTRAINT "ai_workspace_file_embeddings_workspace_id_file_id_fkey" FOREIGN KEY ("workspace_id", "file_id") REFERENCES "ai_workspace_files"("workspace_id", "file_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_jobs" ADD CONSTRAINT "ai_jobs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "app_runtime_settings" ADD CONSTRAINT "app_runtime_settings_last_updated_by_fkey" FOREIGN KEY ("last_updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "app_configs" ADD CONSTRAINT "app_configs_last_updated_by_fkey" FOREIGN KEY ("last_updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "user_stripe_customers" ADD CONSTRAINT "user_stripe_customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blobs" ADD CONSTRAINT "blobs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Unique Constraints (besides primary keys and unique keywords in table defs)
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_session_id_user_id_key" UNIQUE ("session_id", "user_id");
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_type_token_key" UNIQUE ("type", "token");
ALTER TABLE "workspace_user_permissions" ADD CONSTRAINT "workspace_user_permissions_workspace_id_user_id_key" UNIQUE ("workspace_id", "user_id");
ALTER TABLE "features" ADD CONSTRAINT "features_feature_version_key" UNIQUE ("feature", "version"); -- "version" is deprecatedVersion
ALTER TABLE "ai_prompts_messages" ADD CONSTRAINT "ai_prompts_messages_prompt_id_idx_key" UNIQUE ("prompt_id", "idx");
ALTER TABLE "ai_context_embeddings" ADD CONSTRAINT "ai_context_embeddings_context_id_file_id_chunk_key" UNIQUE ("context_id", "file_id", "chunk");
ALTER TABLE "ai_jobs" ADD CONSTRAINT "ai_jobs_created_by_workspace_id_blob_id_key" UNIQUE ("created_by", "workspace_id", "blob_id");
ALTER TABLE "app_runtime_settings" ADD CONSTRAINT "app_runtime_settings_module_key_key" UNIQUE ("module", "key");
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_plan_key" UNIQUE ("user_id", "plan");
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_target_id_plan_key" UNIQUE ("target_id", "plan");


-- Indexes
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "user_connected_accounts_user_id_idx" ON "user_connected_accounts"("user_id");
CREATE INDEX "user_connected_accounts_provider_account_id_idx" ON "user_connected_accounts"("provider_account_id");
CREATE INDEX "workspace_user_permissions_user_id_idx" ON "workspace_user_permissions"("user_id");
CREATE INDEX "user_features_user_id_idx" ON "user_features"("user_id");
CREATE INDEX "user_features_name_idx" ON "user_features"("name");
CREATE INDEX "user_features_feature_id_idx" ON "user_features"("feature_id");
CREATE INDEX "workspace_features_workspace_id_idx" ON "workspace_features"("workspace_id");
CREATE INDEX "workspace_features_name_idx" ON "workspace_features"("name");
CREATE INDEX "workspace_features_feature_id_idx" ON "workspace_features"("feature_id");
CREATE INDEX "snapshots_workspace_id_updated_at_idx" ON "snapshots"("workspace_id", "updated_at");
CREATE INDEX "ai_sessions_messages_session_id_idx" ON "ai_sessions_messages"("session_id");
CREATE INDEX "ai_sessions_metadata_user_id_idx" ON "ai_sessions_metadata"("user_id");
CREATE INDEX "ai_sessions_metadata_user_id_workspace_id_idx" ON "ai_sessions_metadata"("user_id", "workspace_id");
CREATE INDEX "user_invoices_user_id_idx" ON "user_invoices"("user_id");
CREATE INDEX "invoices_target_id_idx" ON "invoices"("target_id");
CREATE INDEX "notifications_user_id_created_at_read_idx" ON "notifications"("user_id", "created_at", "read");
