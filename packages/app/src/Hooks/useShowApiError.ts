import {ErrorCodesKeys} from '@svej/common';
import {useCallback} from 'react';
import {ApiError} from '@/Api';
import {useLanguage} from './Language';
import {useShowToast} from './useToast';

export const useShowApiError = () => {
  const language = useLanguage();
  const showToast = useShowToast();

  const showError = useCallback(
    (error: ApiError | Error | {code: ErrorCodesKeys}, defaultMessage?: string) => {
      if ('code' in error && error.code && error.code in language.api_errors) {
        return showToast({
          type: 'error',
          title: language.errors.ERROR,
          message: language.api_errors[error.code as keyof typeof language.api_errors],
        });
      }

      if (
        error instanceof ApiError &&
        error.problemCode &&
        error.problemCode in language.api_problems
      ) {
        const problemError =
          language.api_problems[error.problemCode as keyof typeof language.api_problems];

        return showToast({
          type: 'error',
          title: problemError.title,
          message: problemError.message,
        });
      }

      if (error instanceof Error) {
        return showToast({
          type: 'error',
          title: language.errors.ERROR,
          message: error.message,
        });
      }

      return showToast({
        type: 'error',
        title: language.errors.ERROR,
        message: defaultMessage || language.api_errors.UnknownError,
      });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );

  return showError;
};
