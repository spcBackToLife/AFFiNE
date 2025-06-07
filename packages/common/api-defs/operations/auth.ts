import type {
  ChangePasswordMutationVariables,
  ChangePasswordMutation,
  ChangeEmailMutationVariables,
  ChangeEmailMutation,
  DeleteAccountMutationVariables,
  DeleteAccountMutation,
  SendChangePasswordEmailMutationVariables,
  SendChangePasswordEmailMutation,
  SendSetPasswordEmailMutationVariables,
  SendSetPasswordEmailMutation,
  SendVerifyChangeEmailMutationVariables,
  SendVerifyChangeEmailMutation,
  SendVerifyEmailMutationVariables,
  SendVerifyEmailMutation,
  VerifyEmailMutationVariables,
  VerifyEmailMutation,
} from '../types/auth-types';

export const changePassword = {
  id: 'auth_change_password' as const, // from GQL: changePassword
  variablesType: null as unknown as ChangePasswordMutationVariables,
  responseType: null as unknown as ChangePasswordMutation,
};

export const changeEmail = {
  id: 'auth_change_email' as const, // from GQL: changeEmail
  variablesType: null as unknown as ChangeEmailMutationVariables,
  responseType: null as unknown as ChangeEmailMutation,
};

export const deleteAccount = {
  id: 'auth_delete_account' as const, // from GQL: deleteAccount
  variablesType: null as unknown as DeleteAccountMutationVariables,
  responseType: null as unknown as DeleteAccountMutation,
};

export const sendChangePasswordEmail = {
  id: 'auth_send_change_password_email' as const, // from GQL: sendChangePasswordEmail
  variablesType: null as unknown as SendChangePasswordEmailMutationVariables,
  responseType: null as unknown as SendChangePasswordEmailMutation,
};

export const sendSetPasswordEmail = {
  id: 'auth_send_set_password_email' as const, // from GQL: sendSetPasswordEmail
  variablesType: null as unknown as SendSetPasswordEmailMutationVariables,
  responseType: null as unknown as SendSetPasswordEmailMutation,
};

export const sendVerifyChangeEmail = {
  id: 'auth_send_verify_change_email' as const, // from GQL: sendVerifyChangeEmail
  variablesType: null as unknown as SendVerifyChangeEmailMutationVariables,
  responseType: null as unknown as SendVerifyChangeEmailMutation,
};

export const sendVerifyEmail = {
  id: 'auth_send_verify_email' as const, // from GQL: sendVerifyEmail
  variablesType: null as unknown as SendVerifyEmailMutationVariables,
  responseType: null as unknown as SendVerifyEmailMutation,
};

export const verifyEmail = {
  id: 'auth_verify_email' as const, // from GQL: verifyEmail
  variablesType: null as unknown as VerifyEmailMutationVariables,
  responseType: null as unknown as VerifyEmailMutation,
};
