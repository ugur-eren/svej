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
import {ApiError, throwApiError} from '@/Api';
import {ApiResponse} from '@/Api/CustomClient';
import {useShowApiError} from './useShowApiError';

export const useInfiniteQuery = <
  TQueryFnData = unknown,
  TData = InfiniteData<
    TQueryFnData extends ApiResponse<Record<number, unknown>>
      ? (TQueryFnData & {ok: true})['data']
      : never
  >,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: Omit<
    UseInfiniteQueryOptions<
      TQueryFnData extends ApiResponse<Record<number, unknown>>
        ? (TQueryFnData & {ok: true})['data']
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
