import {useEffect} from 'react';
import {
  QueryClient,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useReactQuery,
} from '@tanstack/react-query';
import {ApiError, throwApiError} from '@/Api';
import {useShowApiError} from './useShowApiError';

export const useQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData extends {error: null; data?: infer U} ? U : never,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>,
  showErrorToast = true,
  queryClient: QueryClient | undefined = undefined,
): UseQueryResult<TData, ApiError> => {
  const query = useReactQuery(
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
