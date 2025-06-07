import { useState } from 'react';
import useSWR from 'swr';

// TODO: Proper token management will be addressed globally later.
const authToken = 'YOUR_JWT_TOKEN_HERE';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface FetchUserListResponse {
  data: {
    users: User[];
    usersCount: number;
  };
}

const fetchUserList = async (url: string, pageIndex: number, pageSize: number) => {
  const filter = {
    first: pageSize,
    skip: pageIndex * pageSize,
  };
  // Construct the URL with query parameters
  // Note: The backend expects parameters in a 'filter' object,
  // but standard GET requests usually use direct query params.
  // This might need adjustment depending on how the Go backend parses query strings for nested objects.
  // For now, let's assume it can parse `filter[first]` and `filter[skip]` or similar,
  // or that the backend will be adjusted. A common way is to JSON.stringify the filter and pass it as a single param.
  // Given the Go controller comments, it might expect a JSON body even for GET if params are complex,
  // which is unusual. Let's try with query parameters first.
  const queryParams = new URLSearchParams({
    // JSON stringifying the filter is a common workaround for complex objects in GET requests
    filter: JSON.stringify(filter),
  });
  const fullUrl = `${url}?${queryParams}`;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    // TODO: More robust error handling
    const errorText = await response.text();
    console.error('Failed to fetch user list:', errorText);
    throw new Error(`Failed to fetch user list: ${response.statusText}`);
  }

  const result: FetchUserListResponse = await response.json();
  // The backend controller doc says response is { data: { users: [], usersCount: 0 } }
  // which matches FetchUserListResponse.
  return result.data;
};

export const useUserList = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, error, isLoading } = useSWR(
    ['/v1/admin/users/', pagination.pageIndex, pagination.pageSize],
    ([url, pageIndex, pageSize]) => fetchUserList(url, pageIndex, pageSize)
  );

  // Handle loading and error states appropriately
  if (isLoading) {
    // You might want to return a loading state or previous data
    // For now, returning empty/default values
    return {
      users: [],
      pagination,
      setPagination,
      usersCount: 0,
      isLoading: true,
      error: null,
    };
  }

  if (error) {
    // Handle error state
    console.error('Error fetching user list:', error);
    return {
      users: [],
      pagination,
      setPagination,
      usersCount: 0,
      isLoading: false,
      error,
    };
  }

  // Adapt data structure if needed, based on actual fetchUserList response
  // The current fetchUserList is designed to return { users: [], usersCount: 0 }
  const users = data?.users ?? [];
  const usersCount = data?.usersCount ?? 0;

  return {
    users,
    pagination,
    setPagination,
    usersCount,
    isLoading: false,
    error: null,
  };
};
