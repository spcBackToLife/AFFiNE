// acceptInviteByInviteIdMutation import removed
import { Store } from '@toeverything/infra';

// GraphQLService import removed
import type { FetchService } from '../services/fetch'; // Added FetchService import

// Define AcceptInviteResult type based on what acceptInviteByInviteIdMutation returned in `data.acceptInviteById`
// or what the new REST API is expected to return in its `data` field.
// For now, assuming a generic object, but this should be specified.
export interface AcceptInviteResult {
  // Example fields, adjust according to actual data structure
  workspaceId: string;
  status: string; // e.g., "accepted", "failed"
  [key: string]: any;
}

export class AcceptInviteStore extends Store {
  constructor(private readonly fetchService: FetchService) { // Changed to FetchService
    super();
  }

  async acceptInvite(
    workspaceId: string,
    inviteId: string,
    signal?: AbortSignal
  ): Promise<AcceptInviteResult> { // Return type updated
    const res = await this.fetchService.fetch(`/v1/invites/${inviteId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workspaceId }), // Send workspaceId in the body
      signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to accept invite:', errorText);
      // Consider specific error types based on status code if needed
      throw new Error(`Failed to accept invite: ${res.statusText} - ${errorText}`);
    }

    const responseData = await res.json();
    // Proposed REST API returns { data: { /* result object */ } }
    // The GQL version returned data.acceptInviteById
    if (!responseData.data) {
      throw new Error('Accept invite result data is not in the expected format from API response');
    }
    return responseData.data as AcceptInviteResult; // Cast to defined AcceptInviteResult type
  }
}
