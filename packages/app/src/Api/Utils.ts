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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throwApiError = (response: Treaty.TreatyResponse<any>) => {
  if (!response.error) return;

  const errorCode = 'code' in response.error.value ? response.error.value.code : undefined;

  if (response.status >= 400 && response.status < 500) {
    throw new ApiError('Client error', PROBLEM_CODE.CLIENT_ERROR, errorCode, response.error);
  } else if (response.status >= 500 && response.status < 600) {
    throw new ApiError('Server error', PROBLEM_CODE.SERVER_ERROR, errorCode, response.error);
  }

  throw new ApiError('Unknown error', PROBLEM_CODE.UNKNOWN_ERROR, errorCode, response.error);
};
