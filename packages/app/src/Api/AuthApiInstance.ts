import {Config} from '@svej/common';
import type {App} from '@svej/backend';
import {AxiosHeaders} from 'axios';
import {parseSetCookie} from 'cookie';
import {store} from '@/Redux';
import Storage from '@/Utils/Storage';
import {DEFAULT_BASE_URL, DEFAULT_HEADERS} from './Utils';
import {createCustomClient} from './CustomClient';

const {instance, client} = createCustomClient<App>({
  baseURL: DEFAULT_BASE_URL,
  headers: DEFAULT_HEADERS,
  timeout: 15_000,
});

// Attach access token to all requests
instance.axiosInstance.interceptors.request.use(async (request) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
});

// Handle refresh token cookie from server responses
instance.axiosInstance.interceptors.response.use(async (response) => {
  let cookieHeaders: string[] = [];

  if (response.headers instanceof AxiosHeaders) {
    cookieHeaders = response.headers.getSetCookie();
  } else if (response.headers['set-cookie']) {
    cookieHeaders = Array.isArray(response.headers['set-cookie'])
      ? response.headers['set-cookie']
      : [response.headers['set-cookie']];
  }

  if (!cookieHeaders.length) return response;

  const refreshTokenCookie = cookieHeaders.findLast(
    (cookieStr) => parseSetCookie(cookieStr).name === Config.refreshTokenCookieName,
  );
  if (!refreshTokenCookie) return response;

  const cookie = parseSetCookie(refreshTokenCookie);

  // Max-Age has precedence over Expires
  let expiryDate: Date | null = null;
  if (cookie.maxAge) {
    expiryDate = new Date(cookie.maxAge === 0 ? 0 : Date.now() + cookie.maxAge * 1000);
  } else if (cookie.expires) {
    expiryDate = cookie.expires;
  }

  const isExpired = expiryDate && expiryDate.getTime() <= Date.now();

  // No value or expiryDate is in the past, remove the token
  if (!cookie.value || isExpired) {
    await Storage.remove('refreshToken');
    return response;
  }

  await Storage.set('refreshToken', cookie.value);

  return response;
});

const AuthApiInstance = client.auth;

export default AuthApiInstance;
