import {useEffect} from 'react';
import {
  QueryClient,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useReactQuery,
} from '@tanstack/react-query';
import {useShowApiError} from './useShowApiError';
import {ApiError} from '../Api/ApiInstance';

export const useQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData extends {ok: true; data?: infer U} ? U : never,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>,
  showErrorPortal?: boolean,
  queryClient?: QueryClient,
): UseQueryResult<TData, ApiError> => {
  const query = useReactQuery(
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
