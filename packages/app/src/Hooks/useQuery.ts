import {useEffect} from 'react';
import {
  QueryClient,
  QueryFunction,
  QueryKey,
  SkipToken,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useReactQuery,
} from '@tanstack/react-query';
import {Treaty} from '@elysia/eden';
import {ApiError, throwApiError} from '@/Api';
import {useShowApiError} from './useShowApiError';

export const useQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData extends {ok: true; data?: infer U} ? U : never,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<
    UseQueryOptions<
      TQueryFnData extends Treaty.TreatyResponse<Record<number, unknown>>
        ? (TQueryFnData & {ok: true})['data']
        : TQueryFnData,
      ApiError,
      TData,
      TQueryKey
    >,
    'queryFn'
  > & {queryFn?: QueryFunction<TQueryFnData, TQueryKey> | SkipToken},
  showErrorToast = true,
  queryClient: QueryClient | undefined = undefined,
): UseQueryResult<TData, ApiError> => {
  const query = useReactQuery(
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
