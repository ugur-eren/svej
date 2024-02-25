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
  showErrorToast = true,
  queryClient: QueryClient | undefined = undefined,
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
    if (showErrorToast && mutation.error) {
      return showApiError(mutation.error);
    }

    return () => {
      //
    };
  }, [showErrorToast, mutation.error, showApiError]);

  return mutation as any;
};
