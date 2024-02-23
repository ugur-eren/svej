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
  showErrorPortal?: boolean,
  queryClient?: QueryClient,
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
    if (showErrorPortal && query.error) {
      return showApiError(query.error);
    }

    return () => {
      //
    };
  }, [showErrorPortal, query.error, showApiError]);

  return query;
};
