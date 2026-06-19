import {store} from '@/Redux';
import Env from '@/Utils/Env';

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
