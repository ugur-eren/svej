import {ErrorCodesKeys} from 'common';
import {useCallback} from 'react';
import {useLanguage} from './Language';
import {useShowToast} from './useToast';
import {ApiError} from '../Api/ApiInstance';

export const useShowApiError = () => {
  const language = useLanguage();
  const showToast = useShowToast();

  const showError = useCallback(
    (error: ApiError | Error) => {
      if (error instanceof ApiError) {
        if (error.code && error.code in language.api_errors) {
          return showToast({
            type: 'error',
            title: 'Error',
            message: language.api_errors[error.code as ErrorCodesKeys],
          });
        }

        if (error.problemCode && error.problemCode in language.api_problems) {
          const problemError =
            language.api_problems[error.problemCode as keyof typeof language.api_problems];

          return showToast({
            type: 'error',
            title: problemError.title,
            message: problemError.message,
          });
        }
      }

      return showToast({
        type: 'error',
        title: language.errors.ERROR,
        message: error.message,
      });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );

  return showError;
};
