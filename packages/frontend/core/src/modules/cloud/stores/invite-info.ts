// getInviteInfoQuery import removed
import { Store } from '@toeverything/infra';

// GraphQLService import removed
import type { FetchService } from '../services/fetch'; // Added FetchService import

// Define InviteInfo type based on what getInviteInfoQuery returned,
// or what the new REST API is expected to return in its `data` field.
// For now, assuming a generic object, but this should be specified.
export interface InviteInfo {
  // Example fields, adjust according to actual data structure
  id: string;
  workspaceName?: string;
  inviterEmail?: string;
  status?: string;
  [key: string]: any;
}

export class InviteInfoStore extends Store {
  constructor(private readonly fetchService: FetchService) { // Changed to FetchService
    super();
  }

  async getInviteInfo(inviteId?: string, signal?: AbortSignal): Promise<InviteInfo> {
    if (!inviteId) {
      throw new Error('No inviteId provided');
    }

    const res = await this.fetchService.fetch(`/v1/invites/${inviteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to get invite info:', errorText);
      // Consider specific error types based on status code if needed
      throw new Error(`Failed to get invite info: ${res.statusText} - ${errorText}`);
    }

    const responseData = await res.json();
    // Proposed REST API returns { data: { /* invite info object */ } }
    // The GQL version returned data.getInviteInfo
    if (!responseData.data) {
      throw new Error('Invite info data is not in the expected format from API response');
    }
    return responseData.data as InviteInfo; // Cast to defined InviteInfo type
  }
}
