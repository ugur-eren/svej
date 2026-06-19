import {useEffect} from 'react';
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery as useReactInfiniteQuery,
} from '@tanstack/react-query';
import {ApiError, throwApiError} from '@/Api';
import {useShowApiError} from './useShowApiError';

export const useInfiniteQuery = <
  TQueryFnData = unknown,
  TData = InfiniteData<TQueryFnData extends {error: null; data?: infer U} ? U : never>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UseInfiniteQueryOptions<
    TQueryFnData,
    ApiError,
    TData,
    TQueryFnData,
    TQueryKey,
    TPageParam
  >,
  showErrorToast = true,
  queryClient: QueryClient | undefined = undefined,
): UseInfiniteQueryResult<TData, ApiError> => {
  const query = useReactInfiniteQuery(
    {
      ...options,
      queryFn: async (...args) => {
        const response: any = await options.queryFn?.(...args);

        throwApiError(response);

        return response.data;
      },
    },
    queryClient,
  );

  const showApiError = useShowApiError();

  useEffect(() => {
    if (showErrorToast && query.error) {
      return showApiError(query.error);
    }

    return () => {
      //
    };
  }, [showErrorToast, query.error, showApiError]);

  return query;
};
