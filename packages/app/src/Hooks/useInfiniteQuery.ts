import {useEffect} from 'react';
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery as useReactInfiniteQuery,
} from '@tanstack/react-query';
import {useShowApiError} from './useShowApiError';
import {ApiError} from '../Api/ApiInstance';

export const useInfiniteQuery = <
  TQueryFnData = unknown,
  TData = InfiniteData<TQueryFnData extends {ok: true; data?: infer U} ? U : never>,
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
        const result: any = await options.queryFn?.(...args);
        return result?.data;
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
