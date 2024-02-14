import {useEffect} from 'react';
import {
  QueryClient,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useReactQuery,
} from '@tanstack/react-query';
import {useShowToast} from './useToast';
import {ApiError} from '../Api/ApiInstance';

export const useQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>,
  showErrorPortal?: boolean,
  queryClient?: QueryClient,
): UseQueryResult<TData, ApiError> => {
  const query = useReactQuery(options, queryClient);

  const showToast = useShowToast();

  useEffect(() => {
    if (showErrorPortal && query.error) {
      return showToast({
        type: 'error',
        title: 'Error',
        message: query.error.message,
      });
    }

    return () => {
      //
    };
  }, [showToast, showErrorPortal, query.error]);

  return query;
};
