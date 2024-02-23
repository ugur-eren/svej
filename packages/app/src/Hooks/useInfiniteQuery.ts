import {ErrorCodesKeys} from 'common';
import {useEffect} from 'react';
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery as useReactInfiniteQuery,
} from '@tanstack/react-query';
import {useShowToast} from './useToast';
import {ApiError} from '../Api/ApiInstance';
import {useLanguage} from './Language';

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
