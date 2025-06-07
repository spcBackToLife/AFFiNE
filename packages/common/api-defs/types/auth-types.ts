import type { Scalars, Exact, UserType, DeleteAccount } from './shared-types';

// Variables and Response types for Auth operations

// ChangePasswordMutation
export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  userId: Scalars['String']['input']; // In schema.ts, this was userId?: InputMaybe<Scalars['String']['input']>, but GQL file has it as required for non-admin.
  newPassword: Scalars['String']['input'];
}>;

export type ChangePasswordMutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean']['output'];
};

// ChangeEmailMutation
export type ChangeEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;

export type ChangeEmailMutation = {
  __typename?: 'Mutation';
  changeEmail: { __typename?: 'UserType'; id: string; email: string }; // Assuming UserType from shared is sufficient
};

// DeleteAccountMutation (Note: DeleteAccount type itself is in shared-types.ts)
export type DeleteAccountMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteAccountMutation = {
  __typename?: 'Mutation';
  deleteAccount: DeleteAccount;
};

// SendChangePasswordEmailMutation
export type SendChangePasswordEmailMutationVariables = Exact<{
  callbackUrl: Scalars['String']['input'];
}>;

export type SendChangePasswordEmailMutation = {
  __typename?: 'Mutation';
  sendChangePasswordEmail: Scalars['Boolean']['output'];
};

// SendSetPasswordEmailMutation
export type SendSetPasswordEmailMutationVariables = Exact<{
  callbackUrl: Scalars['String']['input'];
}>;

export type SendSetPasswordEmailMutation = {
  __typename?: 'Mutation';
  sendSetPasswordEmail: Scalars['Boolean']['output'];
};

// SendVerifyChangeEmailMutation
export type SendVerifyChangeEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
  email: Scalars['String']['input'];
  callbackUrl: Scalars['String']['input'];
}>;

export type SendVerifyChangeEmailMutation = {
  __typename?: 'Mutation';
  sendVerifyChangeEmail: Scalars['Boolean']['output'];
};

// SendVerifyEmailMutation
export type SendVerifyEmailMutationVariables = Exact<{
  callbackUrl: Scalars['String']['input'];
}>;

export type SendVerifyEmailMutation = {
  __typename?: 'Mutation';
  sendVerifyEmail: Scalars['Boolean']['output'];
};

// VerifyEmailMutation
export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;

export type VerifyEmailMutation = {
  __typename?: 'Mutation';
  verifyEmail: Scalars['Boolean']['output'];
};
