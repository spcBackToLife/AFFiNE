// useMutation import removed
import { useAsyncCallback } from '@affine/core/components/hooks/affine-async-hooks';
// updatePromptMutation import removed
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation'; // Imported useSWRMutation

import type { Prompt } from './prompts';

// TODO: Proper token management will be addressed globally later.
const authToken = 'YOUR_JWT_TOKEN_HERE';

const PROMPTS_API_URL = '/v1/admin/copilot-prompts/';

interface FetchPromptsResponse {
  data: Prompt[];
}

interface UpdatePromptResponse { // Based on controller: { data: { name, model, ... } }
  data: Prompt; // Assuming the response returns the full updated prompt
}


const fetchPrompts = async (url: string): Promise<Prompt[]> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch prompts:', errorText);
    throw new Error(`Failed to fetch prompts: ${response.statusText}`);
  }

  const result: FetchPromptsResponse = await response.json();
  return result.data;
};

// Fetcher for updating a prompt
async function restfulUpdatePrompt(
  url: string, // Will be /v1/admin/copilot-prompts/${promptName}
  { arg }: { arg: { name: string; messages: Prompt['messages'] } }
): Promise<Prompt> { // Returns the updated prompt
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      name: arg.name, // As per controller: name can be in body
      messages: arg.messages,
      // other fields like model, action, config could be sent if API supports & UI allows editing them
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to update prompt:', errorText);
    throw new Error(`Failed to update prompt: ${response.statusText} - ${errorText}`);
  }
  const result: UpdatePromptResponse = await response.json();
  return result.data;
}


export const usePrompt = () => {
  const { data: prompts, error: fetchError, isLoading: isLoadingPrompts } = useSWR(PROMPTS_API_URL, fetchPrompts);
  const { mutate: revalidatePromptsList } = useSWRConfig();

  const {
    trigger: triggerUpdatePrompt,
    isMutating: isUpdatingPrompt,
    error: updatePromptError
  } = useSWRMutation(
    // The key is a function that generates the URL based on the prompt name
    (promptName: string) => `${PROMPTS_API_URL}${promptName}`,
    restfulUpdatePrompt // The fetcher function
  );

  const updatePrompt = useAsyncCallback(
    async ({
      name,
      messages,
    }: {
      name: string;
      messages: Prompt['messages'];
    }) => {
      try {
        await triggerUpdatePrompt({ name, messages }); // name is used for URL via key, and in body
        await revalidatePromptsList(PROMPTS_API_URL);
        toast.success('Prompt updated successfully');
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        toast.error(`Failed to update prompt: ${message}`);
        // Log SWRMutation error if available, otherwise the caught error
        console.error("Update prompt error details:", updatePromptError || e);
      }
    },
    [triggerUpdatePrompt, revalidatePromptsList, updatePromptError]
  );

  if (isLoadingPrompts) {
    return {
      prompts: [],
      updatePrompt,
      isLoading: true,
      isUpdating: false, // Not updating if still loading initial list
      error: null,
      updateError: null,
    };
  }

  if (fetchError) {
    console.error('Error fetching prompts:', fetchError);
    return {
      prompts: [],
      updatePrompt,
      isLoading: false,
      isUpdating: false,
      error: fetchError,
      updateError: null,
    };
  }

  return {
    prompts: prompts || [],
    updatePrompt,
    isLoading: false,
    isUpdating: isUpdatingPrompt,
    error: null, // No fetch error at this point
    updateError: updatePromptError,
  };
};
