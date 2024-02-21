import {ErrorCodesKeys} from 'common';
import {useEffect} from 'react';
import {
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
  useMutation as useReactMutation,
} from '@tanstack/react-query';
import {useShowToast} from './useToast';
import {ApiError} from '../Api/ApiInstance';
import {useLanguage} from './Language';

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
  const mutation = useReactMutation(options, queryClient);

  const language = useLanguage();
  const showToast = useShowToast();

  useEffect(() => {
    if (showErrorPortal && mutation.error) {
      if (mutation.error.code && mutation.error.code in language.api_errors) {
        return showToast({
          type: 'error',
          title: 'Error',
          message: language.api_errors[mutation.error.code as ErrorCodesKeys],
        });
      }

      if (mutation.error.cause && mutation.error.problemCode in language.api_problems) {
        const problemError =
          language.api_problems[mutation.error.problemCode as keyof typeof language.api_problems];

        return showToast({
          type: 'error',
          title: problemError.title,
          message: problemError.message,
        });
      }

      return showToast({
        type: 'error',
        title: 'Error',
        message: mutation.error.message,
      });
    }

    return () => {
      //
    };
  }, [language, showToast, showErrorPortal, mutation.error]);

  return {
    ...mutation,
    data: (mutation.data as any)?.data,
    mutate: (variables: any, mutateOptions: any) => {
      return mutation.mutate(variables, {
        onSuccess: mutateOptions.onSuccess
          ? (data, vars, ctx) => {
              mutateOptions.onSuccess((data as any).data, vars, ctx);
            }
          : undefined,

        onSettled: mutateOptions.onSettled
          ? (data, error, vars, ctx) => {
              mutateOptions.onSettled((data as any).data, error, vars, ctx);
            }
          : undefined,
      });
    },
  } as any;
};
