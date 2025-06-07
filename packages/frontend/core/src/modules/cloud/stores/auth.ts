// Removed GQL mutation imports:
// deleteAccountMutation,
// removeAvatarMutation,
// updateUserProfileMutation,
// uploadAvatarMutation,
import { Store } from '@toeverything/infra';

import type { GlobalState } from '../../storage';
import type { AuthSessionInfo } from '../entities/session';
import type { AuthProvider } from '../provider/auth';
import type { FetchService } from '../services/fetch';
import type { GraphQLService } from '../services/graphql';
import type { ServerService } from '../services/server';

export interface AccountProfile {
  id: string;
  email: string;
  name: string;
  hasPassword: boolean;
  avatarUrl: string | null;
  emailVerified: string | null;
}

export class AuthStore extends Store {
  constructor(
    private readonly fetchService: FetchService,
    private readonly gqlService: GraphQLService,
    private readonly globalState: GlobalState,
    private readonly serverService: ServerService,
    private readonly authProvider: AuthProvider
  ) {
    super();
  }

  watchCachedAuthSession() {
    return this.globalState.watch<AuthSessionInfo>(
      `${this.serverService.server.id}-auth`
    );
  }

  getCachedAuthSession() {
    return this.globalState.get<AuthSessionInfo>(
      `${this.serverService.server.id}-auth`
    );
  }

  setCachedAuthSession(session: AuthSessionInfo | null) {
    this.globalState.set(`${this.serverService.server.id}-auth`, session);
  }

  getClientNonce() {
    return this.globalState.get<string>('auth-client-nonce');
  }

  setClientNonce(nonce: string) {
    this.globalState.set('auth-client-nonce', nonce);
  }

  async fetchSession() {
    const url = `/api/auth/session`;
    const options: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await this.fetchService.fetch(url, options);
    const data = (await res.json()) as {
      user?: AccountProfile | null;
    };
    if (!res.ok)
      throw new Error('Get session fetch error: ' + JSON.stringify(data));
    return data; // Return null if data empty
  }

  async signInMagicLink(email: string, token: string) {
    await this.authProvider.signInMagicLink(
      email,
      token,
      this.getClientNonce()
    );
  }

  async signInOauth(code: string, state: string, provider: string) {
    return await this.authProvider.signInOauth(
      code,
      state,
      provider,
      this.getClientNonce()
    );
  }

  async signInPassword(credential: {
    email: string;
    password: string;
    verifyToken?: string;
    challenge?: string;
  }) {
    await this.authProvider.signInPassword(credential);
  }

  async signOut() {
    await this.authProvider.signOut();
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    // Assuming this.fetchService.fetch can handle FormData and doesn't set
    // 'Content-Type': 'application/json' by default for FormData.
    // If it does, a more direct `fetch` or a specialized method in FetchService might be needed.
    const res = await this.fetchService.fetch(`/v1/users/me/avatar`, {
      method: 'POST',
      body: formData,
      // Content-Type header is usually set automatically by the browser for FormData
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to upload avatar: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    return responseData.data; // { avatarUrl: "string" }
  }

  async removeAvatar(): Promise<void> {
    const res = await this.fetchService.fetch(`/v1/users/me/avatar`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      // Handle cases where response might not have a JSON body (e.g. 500 internal server error)
      let errorText = res.statusText;
      try {
        const errorData = await res.json();
        errorText = errorData.message || errorText;
      } catch (e) {
        // Ignore if response body is not JSON
      }
      throw new Error(`Failed to remove avatar: ${errorText}`);
    }
    // For 204 No Content, res.json() would fail.
    // If API guarantees { data: { success: true } } for 200 OK on DELETE:
    // const responseData = await res.json();
    // if (!responseData.data.success) throw new Error('Remove avatar reported as unsuccessful.');
    // For now, assume 204 or 200 OK with success body means success.
  }

  async updateLabel(label: string): Promise<AccountProfile> { // Assuming it returns the updated profile
    const res = await this.fetchService.fetch(`/v1/users/me/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: label }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update profile name: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    return responseData.data; // { /* updated user profile object */ }
  }

  async checkUserByEmail(email: string) {
    const res = await this.fetchService.fetch('/api/auth/preflight', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'content-type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to check user by email: ${email}`);
    }

    const data = (await res.json()) as {
      registered: boolean;
      hasPassword: boolean;
      magicLink: boolean;
    };

    return data;
  }

  async deleteAccount(): Promise<boolean> { // Returning boolean for success
    const res = await this.fetchService.fetch(`/v1/users/me`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      let errorText = res.statusText;
      try {
        const errorData = await res.json();
        errorText = errorData.message || errorText;
      } catch (e) {
        // Ignore
      }
      throw new Error(`Failed to delete account: ${errorText}`);
    }

    // Handle 204 No Content or a JSON response like { data: { success: true } }
    if (res.status === 204) {
      return true;
    }

    try {
      const responseData = await res.json();
      return responseData.data?.success === true;
    } catch (e) {
      // If res.json() fails after a 2xx status, assume success if no specific content needed
      return res.ok;
    }
  }
}
