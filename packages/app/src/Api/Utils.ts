import {Treaty} from '@elysia/eden';
import {store} from '@/Redux';
import Env from '@/Utils/Env';
import {PROBLEM_CODE, ApiError} from './Error';

export const DEFAULT_BASE_URL = Env.SVEJ_PUBLIC_API_URL;

export const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * Fetch wrapper that automatically includes the access token from the Redux store in the Authorization header.
 *
 * Uses a direct fetch call to avoid infinite loops with interceptors.
 */
export const fetchWithAuth: typeof fetch = async (input, init) => {
  const headers = new Headers(input instanceof Request ? input.headers : undefined);

  if (init?.headers) {
    new Headers(init.headers).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const token = store.getState().auth.accessToken;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input instanceof Request ? input.clone() : input, {
    ...init,
    headers,
  });
};

export function throwApiError<
  TRes extends Record<number, unknown>,
  TResParam = Treaty.TreatyResponse<TRes>,
>(response: TResParam): asserts response is TResParam & {error: null} {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = response as any;
  if (!res.error) return;

  const errorCode = 'code' in res.error.value ? res.error.value.code : undefined;

  if (res.status >= 400 && res.status < 500) {
    throw new ApiError('Client error', PROBLEM_CODE.CLIENT_ERROR, errorCode, res.error);
  } else if (res.status >= 500 && res.status < 600) {
    throw new ApiError('Server error', PROBLEM_CODE.SERVER_ERROR, errorCode, res.error);
  }

  throw new ApiError('Unknown error', PROBLEM_CODE.UNKNOWN_ERROR, errorCode, res.error);
}
