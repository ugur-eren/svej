import Env from '@/Utils/Env';
import {ApiError} from './Error';
import type {ApiErrorResponse, ApiOkResponse} from './CustomClient';

export const DEFAULT_BASE_URL = Env.SVEJ_PUBLIC_API_URL;

export const DEFAULT_HEADERS: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export function throwApiError<
  TRes extends ApiErrorResponse<unknown, number> | ApiOkResponse<unknown, number>,
>(response: TRes): asserts response is TRes & {ok: true} {
  if (!response.ok) {
    throw new ApiError(
      response.originalError.message,
      response.problem,
      (response.data as any)?.code,
      (response.data as any)?.error,
    );
  }
}
