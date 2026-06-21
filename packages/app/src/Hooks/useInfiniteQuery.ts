import {useEffect} from 'react';
import {
  InfiniteData,
  QueryClient,
  QueryFunction,
  QueryKey,
  SkipToken,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery as useReactInfiniteQuery,
} from '@tanstack/react-query';
import {Treaty} from '@elysia/eden';
import {ApiError, throwApiError} from '@/Api';
import {useShowApiError} from './useShowApiError';

export const useInfiniteQuery = <
  TQueryFnData = unknown,
  TData = InfiniteData<TQueryFnData extends {error: null; data?: infer U} ? U : never>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: Omit<
    UseInfiniteQueryOptions<
      TQueryFnData extends Treaty.TreatyResponse<Record<number, unknown>>
        ? (TQueryFnData & {error: null})['data']
        : TQueryFnData,
      ApiError,
      TData,
      TQueryKey,
      TPageParam
    >,
    'queryFn'
  > & {queryFn?: QueryFunction<TQueryFnData, TQueryKey, TPageParam> | SkipToken},
  showErrorToast = true,
  queryClient: QueryClient | undefined = undefined,
): UseInfiniteQueryResult<TData, ApiError> => {
  const query = useReactInfiniteQuery(
    {
      ...options,
      queryFn: async (...args) => {
        if (typeof options.queryFn !== 'function') return options.queryFn;

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
