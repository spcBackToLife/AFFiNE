import { Button } from '@affine/admin/components/ui/button';
// useMutation import removed
import { notify } from '@affine/component';
import type { UserFriendlyError } from '@affine/error'; // Keep for type consistency if error object is similar
// sendTestEmailMutation import removed
import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation'; // Imported useSWRMutation

import type { AppConfig } from '../config';

// TODO: Proper token management will be addressed globally later.
const authToken = 'YOUR_JWT_TOKEN_HERE';
const SEND_TEST_EMAIL_API_URL = '/v1/admin/mailer/send-test';

type SMTPConfig = AppConfig['mailer']['SMTP'];

interface SendTestEmailResponseData {
  success: boolean;
  message: string;
}
interface SendTestEmailResponse {
  data: SendTestEmailResponseData;
}

// Fetcher for sending a test email
async function restfulSendTestEmail(
  url: string,
  { arg }: { arg: SMTPConfig }
): Promise<SendTestEmailResponseData> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(arg), // Send SMTPConfig directly as the body
  });

  const result: SendTestEmailResponse = await response.json();

  if (!response.ok || !result.data.success) {
    console.error('Failed to send test email:', result.data.message || response.statusText);
    throw new Error(result.data.message || `Failed to send test email: ${response.statusText}`);
  }
  return result.data;
}

export function SendTestEmail({ appConfig }: { appConfig: AppConfig }) {
  const { trigger: triggerSendTestEmail, isMutating } = useSWRMutation(
    SEND_TEST_EMAIL_API_URL,
    restfulSendTestEmail
  );

  const onClick = useCallback(async () => {
    try {
      const result = await triggerSendTestEmail(appConfig.mailer.SMTP);
      notify.success({
        title: 'Test email sent',
        message: result.message || 'The test email has been successfully sent.',
      });
    } catch (err) {
      // Error object might be an instance of Error, or UserFriendlyError if the fetcher normalizes it.
      // For now, casting to Error to access message.
      const errorMessage = err instanceof Error ? err.message : String(err);
      notify.error({
        title: 'Failed to send test email',
        message: errorMessage,
      });
      console.error("Send test email error details:", err);
    }
  }, [appConfig, triggerSendTestEmail]);

  return <Button onClick={onClick} disabled={isMutating}>Send Test Email</Button>;
}
