import {
  gqlFetcherFactory,
  type GraphQLQuery,
  type QueryOptions,
  type QueryResponse,
} from '@affine/graphql';
import type { GraphQLError } from 'graphql';
import { useCallback, useMemo } from 'react';
import type { SWRConfiguration, SWRResponse } from 'swr';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import useSWRInfinite from 'swr/infinite';

/**
 * A `useSWR` wrapper for sending graphql queries
 *
 * @example
 *
 * ```ts
 * import { someQuery, someQueryWithNoVars } from '@affine/graphql'
 *
 * const swrResponse1 = useQuery({
 *   query: workspaceByIdQuery,
 *   variables: { id: '1' }
 * })
 *
 * const swrResponse2 = useQuery({
 *   query: someQueryWithNoVars
 * })
 * ```
 */
type useQueryFn = <Query extends GraphQLQuery>(
  options?: QueryOptions<Query>,
  config?: Omit<
    SWRConfiguration<
      QueryResponse<Query>,
      GraphQLError,
      (options: QueryOptions<Query>) => Promise<QueryResponse<Query>>
    >,
    'fetcher'
  >
) => SWRResponse<
  QueryResponse<Query>,
  GraphQLError,
  {
    suspense: true;
  }
>;

const createUseQuery =
  (immutable: boolean): useQueryFn =>
  (options, config) => {
    const configWithSuspense: SWRConfiguration = useMemo(
      () => ({
        suspense: true,
        ...config,
      }),
      [config]
    );

    const useSWRFn = immutable ? useSWRImmutable : useSWR;
    return useSWRFn(
      options ? () => ['cloud', options.query.id, options.variables] : null,
      options ? () => gqlFetcher(options) : null,
      configWithSuspense
    );
  };

export const useQuery = createUseQuery(false);
export const useQueryImmutable = createUseQuery(true);

// Placeholder for auth token - in a real app, this would come from auth context/storage
const authToken = 'YOUR_JWT_TOKEN_HERE';

export const gqlFetcher = async <Query extends GraphQLQuery>(
  options: QueryOptions<Query>
): Promise<QueryResponse<Query>> => {
  const { query, variables, operationName } = options;

  // Use query.id as the operation ID for the endpoint
  // Ensure query.id exists and is a string
  let operationId = query.id;
  if (!operationId || typeof operationId !== 'string') {
    // TODO(@forehalo): this is a temp workaround, need to be fixed
    // throw new Error('Query ID is missing or invalid for constructing the API endpoint.');
    if (query.id) {
      // @ts-expect-error ignore
      operationId = query.id.id;
    } else if (operationName) {
      // @ts-expect-error ignore
      operationId = operationName;
    } else {
      throw new Error(
        'Query ID is missing or invalid for constructing the API endpoint.'
      );
    }
  }

  const originalOperationIdForError = String(operationId); // For error messages
  let processedPath = String(operationId);
  const remainingVariables = { ...(variables || {}) }; // Shallow copy for modification

  // Handle dynamic path parameters, e.g., process 'action_:param'
  // First, split by underscores to handle segments like 'action_:paramName_otherpart'
  // Then, within each segment, check for ':paramName'
  const segments = processedPath.split('_');
  const newSegments = [];
  for (const segment of segments) {
    if (segment.includes(':')) {
      const paramMatch = segment.match(/:(\w+)/);
      if (paramMatch && paramMatch[1]) {
        const varName = paramMatch[1];
        if (remainingVariables && remainingVariables[varName] !== undefined) {
          newSegments.push(segment.replace(paramMatch[0], String(remainingVariables[varName])));
          delete remainingVariables[varName];
        } else {
          throw new Error(
            `Dynamic path parameter '${varName}' is missing in variables for operation '${originalOperationIdForError}'`
          );
        }
      } else {
        // Segment includes ':' but not in the expected :param format, treat as normal segment
        newSegments.push(segment);
      }
    } else {
      newSegments.push(segment);
    }
  }
  processedPath = newSegments.join('_');

  // Convert underscores to slashes for the final path
  const finalApiPath = processedPath.replace(/_/g, '/');
  const endpoint = `/v1/${finalApiPath}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(remainingVariables), // Send potentially modified variables
  });

  if (!response.ok) {
    // Handle HTTP errors
    const errorText = await response.text();
    // Assuming error response from Go service is JSON with an errors field
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.errors) {
        // Mimic GraphQL error structure
        throw { message: errorJson.errors[0]?.message || 'API request failed', extensions: errorJson.errors };
      }
    } catch (e) {
      // If parsing fails or not the expected structure, throw with the text
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    // Fallback if error parsing didn't throw
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = await response.json();

  // Assuming the Go service returns data in a "data" field, similar to GraphQL
  // And errors in an "errors" field
  if (result.errors) {
    // Mimic GraphQL error structure for SWR
    // TODO: improve error handling to conform to GraphQLError[] if possible
    throw { message: result.errors[0]?.message || 'API error', extensions: result.errors };
  }

  // The actual data is expected to be directly in result.data for this new API
  // or just result itself if the Go service doesn't wrap it in `data`
  // For now, let's assume it might be result.data or result directly
  // The original gqlFetcherFactory expected a structure like { data: ..., errors: ... }
  // We need to ensure the returned shape is QueryResponse<Query>
  // which is type QueryResponse<Query extends GraphQLQuery> = { data: Query['data']; errors?: GraphQLError[] };

  // If the Go service returns the data directly (not nested under a 'data' property)
  // and we need to fit it into the QueryResponse structure:
  if (result.data !== undefined) {
    return { data: result.data, errors: result.errors } as QueryResponse<Query>;
  } else {
    // If the service returns data directly, and it's what Query['data'] expects
    // This might require adjustment based on actual Go service response
    return { data: result, errors: result.errors } as QueryResponse<Query>;
  }
};

export function useQueryInfinite<Query extends GraphQLQuery>(
  options: Omit<QueryOptions<Query>, 'variables'> & {
    getVariables: (
      pageIndex: number,
      previousPageData: QueryResponse<Query>
    ) => QueryOptions<Query>['variables'];
  },
  config?: Omit<
    SWRConfiguration<
      QueryResponse<Query>,
      GraphQLError | GraphQLError[],
      (options: QueryOptions<Query>) => Promise<QueryResponse<Query>>
    >,
    'fetcher'
  >
) {
  const configWithSuspense: SWRConfiguration = useMemo(
    () => ({
      suspense: true,
      ...config,
    }),
    [config]
  );

  const { data, setSize, size, error } = useSWRInfinite<
    QueryResponse<Query>,
    GraphQLError | GraphQLError[]
  >(
    (pageIndex: number, previousPageData: QueryResponse<Query>) => [
      'cloud',
      options.query.id,
      options.getVariables(pageIndex, previousPageData),
    ],
    async ([_, __, variables]) => {
      const params = { ...options, variables } as QueryOptions<Query>;
      return gqlFetcher(params);
    },
    configWithSuspense
  );

  const loadingMore = size > 0 && data && !data[size - 1];

  // TODO(@Peng): find a generic way to know whether or not there are more items to load
  const loadMore = useCallback(() => {
    if (loadingMore) {
      return;
    }
    setSize(size => size + 1).catch(err => {
      console.error(err);
    });
  }, [loadingMore, setSize]);
  return {
    data,
    error,
    loadingMore,
    loadMore,
  };
}
