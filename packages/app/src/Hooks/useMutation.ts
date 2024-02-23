import {useEffect} from 'react';
import {
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
  useMutation as useReactMutation,
} from '@tanstack/react-query';
import {useShowApiError} from './useShowApiError';
import {ApiError} from '../Api/ApiInstance';

export const useMutation = <
  TFnData = unknown,
  TData = TFnData extends {ok: true; data?: infer U} ? U : never,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TFnData, ApiError, TVariables, TContext>,
  showErrorPortal?: boolean,
  queryClient?: QueryClient,
): UseMutationResult<TData, ApiError, TVariables, TContext> => {
  const mutation = useReactMutation(
    {
      ...options,
      mutationFn: async (...args) => {
        const result: any = await options.mutationFn?.(...args);
        return result?.data;
      },
    },
    queryClient,
  );

  const showApiError = useShowApiError();

  useEffect(() => {
    if (showErrorPortal && mutation.error) {
      return showApiError(mutation.error);
    }

    return () => {
      //
    };
  }, [showErrorPortal, mutation.error, showApiError]);

  return mutation as any;
};
