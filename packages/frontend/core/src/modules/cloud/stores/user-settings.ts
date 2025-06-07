// GQL imports removed:
// type GetUserSettingsQuery,
// getUserSettingsQuery,
// updateUserSettingsMutation,
import type { UpdateUserSettingsInput } from '@affine/graphql'; // Keep if type is still used
import { Store } from '@toeverything/infra';

// GraphQLService import removed
import type { FetchService } from '../services/fetch'; // Added FetchService import

// Define UserSettings based on the expected REST response, or keep if compatible
// Assuming the REST response for GET /v1/users/me/settings -> { data: UserSettings }
// and for PUT /v1/users/me/settings -> { data: UserSettings }
// If UserSettings from GQL (NonNullable<GetUserSettingsQuery['currentUser']>['settings'])
// is compatible with the REST response structure, it can be kept.
// For this refactoring, we'll assume the structure returned by REST is directly the UserSettings object.
export interface UserSettings {
  // Define structure based on what the backend returns for user settings
  // Example:
  emailNotifications?: boolean;
  darkMode?: boolean;
  [key: string]: any; // Allow other settings
}

export type { UpdateUserSettingsInput };

export class UserSettingsStore extends Store {
  constructor(private readonly fetchService: FetchService) { // Changed to FetchService
    super();
  }

  async getUserSettings(): Promise<UserSettings | undefined> {
    const res = await this.fetchService.fetch('/v1/users/me/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to get user settings:', errorText);
      // Decide if to throw or return undefined based on original behavior (original returns undefined on error implicitly)
      if (res.status === 404) return undefined; // Example: User might not have settings yet
      throw new Error(`Failed to get user settings: ${res.statusText} - ${errorText}`);
    }

    const responseData = await res.json();
    // REST API returns { data: { /* user settings object */ } }
    return responseData.data;
  }

  async updateUserSettings(settings: UpdateUserSettingsInput): Promise<UserSettings> {
    const res = await this.fetchService.fetch('/v1/users/me/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings), // Send settings directly as body
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to update user settings:', errorText);
      throw new Error(`Failed to update user settings: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    // REST API returns { data: { /* updated user settings object */ } }
    return responseData.data;
  }
}
