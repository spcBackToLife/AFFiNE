import type {
  CreateCheckoutSessionInput,
  SubscriptionRecurring,
  SubscriptionPlan, // Keep SubscriptionPlan if it's used as an enum/type
} from '@affine/graphql';
// Removed GQL query/mutation imports:
// cancelSubscriptionMutation,
// createCheckoutSessionMutation,
// getWorkspaceSubscriptionQuery,
// pricesQuery,
// resumeSubscriptionMutation,
// subscriptionQuery,
// updateSubscriptionMutation,
// SubscriptionPlan might be an enum used in types, keep if so. Otherwise, if it's just for GQL variables, it might not be needed.
// For now, assuming SubscriptionPlan is a TypeScript enum/type used in method signatures.
import { SubscriptionPlan } from '@affine/graphql'; // Keep if it's an enum
import { Store } from '@toeverything/infra';

import type { GlobalCache } from '../../storage';
import type { UrlService } from '../../url';
import type { SubscriptionType } from '../entities/subscription';
// GraphQLService import might become unused if all GQL calls are removed from this store.
// For now, keeping it as other methods might exist or be added.
import type { GraphQLService } from '../services/graphql';
import type { FetchService } from '../services/fetch'; // Added FetchService import
import type { ServerService } from '../services/server';

const SUBSCRIPTION_CACHE_KEY = 'subscription:';

const getDefaultSubscriptionSuccessCallbackLink = (
  baseUrl: string,
  plan?: SubscriptionPlan | null,
  scheme?: string
) => {
  const path =
    plan === SubscriptionPlan.Team
      ? '/upgrade-success/team'
      : plan === SubscriptionPlan.AI
        ? '/ai-upgrade-success'
        : '/upgrade-success';
  const urlString = baseUrl + path;
  const url = new URL(urlString);
  if (scheme) {
    url.searchParams.set('scheme', scheme);
  }
  return url.toString();
};

export class SubscriptionStore extends Store {
  constructor(
    private readonly gqlService: GraphQLService, // Keep for now, might be unused later
    private readonly fetchService: FetchService, // Added
    private readonly globalCache: GlobalCache,
    private readonly urlService: UrlService,
    private readonly serverService: ServerService
  ) {
    super();
  }

  async fetchSubscriptions(abortSignal?: AbortSignal) {
    const res = await this.fetchService.fetch('/v1/users/me/subscriptions', {
      signal: abortSignal,
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch subscriptions: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    // The GQL query returned { currentUser: { id, subscriptions } }
    // The REST API returns { data: { userId, subscriptions } }
    // Assuming responseData.data matches the structure { userId, subscriptions }
    if (!responseData.data) { // Or more specific check like !responseData.data.userId
      throw new Error('User data not available in fetchSubscriptions response');
    }
    return responseData.data;
  }

  async fetchWorkspaceSubscriptions(
    workspaceId: string,
    abortSignal?: AbortSignal
  ) {
    const res = await this.fetchService.fetch(`/v1/workspaces/${workspaceId}/subscription`, {
      signal: abortSignal,
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch workspace subscription: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    // GQL returned { workspace: { subscription: { id, ... } } }
    // REST returns { data: { workspaceId (this is new), subscription: { ... } } }
    // The store method needs to return { workspaceId (from sub.id), subscription }
    // Let's adjust to return the new structure directly if it's more convenient: { workspaceId, subscription }
    if (!responseData.data) { // Or more specific check like !responseData.data.workspaceId
      throw new Error('Workspace subscription data not available in response');
    }
    return responseData.data; // This is { workspaceId (actual workspaceId), subscription }
  }

  async mutateResumeSubscription(
    idempotencyKey: string,
    plan?: SubscriptionPlan,
    abortSignal?: AbortSignal,
    workspaceId?: string
  ) {
    const res = await this.fetchService.fetch('/v1/subscriptions/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ plan, workspaceId }),
      signal: abortSignal,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to resume subscription: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    return responseData.data; // Assuming { data: { /* updated subscription */ } }
  }

  async mutateCancelSubscription(
    idempotencyKey: string,
    plan?: SubscriptionPlan,
    abortSignal?: AbortSignal,
    workspaceId?: string
  ) {
    const res = await this.fetchService.fetch('/v1/subscriptions/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ plan, workspaceId }),
      signal: abortSignal,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to cancel subscription: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    return responseData.data; // Assuming { data: { /* result */ } }
  }

  getCachedSubscriptions(userId: string) {
    return this.globalCache.get<SubscriptionType[]>(
      SUBSCRIPTION_CACHE_KEY + userId
    );
  }

  setCachedSubscriptions(userId: string, subscriptions: SubscriptionType[]) {
    return this.globalCache.set(SUBSCRIPTION_CACHE_KEY + userId, subscriptions);
  }

  getCachedWorkspaceSubscription(workspaceId: string) {
    return this.globalCache.get<SubscriptionType>(
      SUBSCRIPTION_CACHE_KEY + workspaceId
    );
  }

  setCachedWorkspaceSubscription(
    workspaceId: string,
    subscription: SubscriptionType
  ) {
    return this.globalCache.set(
      SUBSCRIPTION_CACHE_KEY + workspaceId,
      subscription
    );
  }

  async setSubscriptionRecurring( // Made async
    idempotencyKey: string,
    recurring: SubscriptionRecurring,
    plan?: SubscriptionPlan,
    workspaceId?: string
  ) {
    const res = await this.fetchService.fetch('/v1/subscriptions/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ recurring, plan, workspaceId }),
      // No abortSignal was passed to original, can be added if needed
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update subscription recurring status: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    // Original GQL returned the whole mutation response, e.g., { updateSubscription: { ... } }
    // Assuming REST returns { data: { /* updated subscription */ } }, so return responseData.data
    return responseData.data;
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput) {
    const processedInput = {
      ...input,
      successCallbackLink:
        input.successCallbackLink ||
        getDefaultSubscriptionSuccessCallbackLink(
          this.serverService.server.baseUrl,
          input.plan,
          this.urlService.getClientScheme()
        ),
    };
    const res = await this.fetchService.fetch('/v1/checkout/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processedInput), // Send the processed input
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create checkout session: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    return responseData.data; // Assuming { data: { /* checkout session object */ } }
  }

  async fetchSubscriptionPrices(abortSignal?: AbortSignal) {
    const res = await this.fetchService.fetch('/v1/prices', {
      signal: abortSignal,
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch prices: ${res.statusText} - ${errorText}`);
    }
    const responseData = await res.json();
    return responseData.data; // Assuming { data: [ /* price objects */ ] }
  }
}
