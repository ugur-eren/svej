import {ErrorCodesKeys} from 'common';
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
import {useLanguage} from './Language';

export const useQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData extends {ok: true; data?: infer U} ? U : never,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>,
  showErrorPortal?: boolean,
  queryClient?: QueryClient,
): UseQueryResult<TData, ApiError> => {
  const query = useReactQuery(options, queryClient);

  const language = useLanguage();
  const showToast = useShowToast();

  useEffect(() => {
    if (showErrorPortal && query.error) {
      if (query.error.code && query.error.code in language.api_errors) {
        return showToast({
          type: 'error',
          title: 'Error',
          message: language.api_errors[query.error.code as ErrorCodesKeys],
        });
      }

      if (query.error.cause && query.error.problemCode in language.api_problems) {
        const problemError =
          language.api_problems[query.error.problemCode as keyof typeof language.api_problems];

        return showToast({
          type: 'error',
          title: problemError.title,
          message: problemError.message,
        });
      }

      return showToast({
        type: 'error',
        title: 'Error',
        message: query.error.message,
      });
    }

    return () => {
      //
    };
  }, [language, showToast, showErrorPortal, query.error]);

  return query;
};
