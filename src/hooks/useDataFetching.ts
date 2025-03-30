import { useQuery, useMutation, useQueryClient } from 'react-query';
import { QueryKey } from 'react-query';

interface FetchOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
}

interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export const useDataFetching = <T>(
  queryKey: QueryKey,
  fetchFn: () => Promise<T>,
  options: FetchOptions = {}
) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 30 * 60 * 1000, // 30 minutes
    retry = 3,
  } = options;

  return useQuery<T, Error>(queryKey, fetchFn, {
    enabled,
    staleTime,
    cacheTime,
    retry,
  });
};

export const useDataMutation = <T, R>(
  mutationFn: (data: T) => Promise<R>,
  queryKey: QueryKey,
  options: MutationOptions<R> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<R, Error, T>(mutationFn, {
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(queryKey);
      options.onSuccess?.(data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
    onSettled: () => {
      options.onSettled?.();
    },
  });
};

// Example usage:
/*
const { data, isLoading, error } = useDataFetching(
  ['listings'],
  () => fetchListings(),
  {
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  }
);

const mutation = useDataMutation(
  (newListing) => createListing(newListing),
  ['listings'],
  {
    onSuccess: (data) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  }
);
*/ 