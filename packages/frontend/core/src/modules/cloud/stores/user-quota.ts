// quotaQuery import removed
import { Store } from '@toeverything/infra';

// GraphQLService import removed
import type { FetchService } from '../services/fetch'; // Added FetchService import

export class UserQuotaStore extends Store {
  constructor(private readonly fetchService: FetchService) { // Changed to FetchService
    super();
  }

  async fetchUserQuota(abortSignal?: AbortSignal) {
    const res = await this.fetchService.fetch('/v1/users/me/quota', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Good practice, though may not be strictly needed for GET
      },
      signal: abortSignal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch user quota: ${res.statusText} - ${errorText}`);
    }

    const responseData = await res.json();

    // Proposed REST response: { data: { userId: "string", quota: { /* quota details */ }, used: number } }
    // Current GQL processing: data.currentUser.id, data.currentUser.quota, data.currentUser.quotaUsage.storageQuota

    // Ensure responseData.data and its nested properties exist
    if (!responseData.data || typeof responseData.data.userId === 'undefined' ||
        typeof responseData.data.quota === 'undefined' || typeof responseData.data.used === 'undefined') {
      throw new Error('User quota data is not in the expected format from API response');
    }

    return {
      userId: responseData.data.userId,
      quota: responseData.data.quota,
      used: responseData.data.used,
    };
  }
}
