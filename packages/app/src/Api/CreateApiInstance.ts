import {Config} from '@svej/common';
import {ApisauceConfig, create} from 'apisauce';
import {parseSetCookie} from 'cookie';
import Env from '../Utils/Env';
import Storage from '../Utils/Storage';
import {ApiError} from './Error';

const DefaultOptions: ApisauceConfig = {
  baseURL: Env.SVEJ_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const createApiInstance = (options?: ApisauceConfig) => {
  const ApiInstance = create({
    ...DefaultOptions,
    ...options,

    headers: {
      ...DefaultOptions.headers,
      ...options?.headers,
    },
  });

  ApiInstance.addResponseTransform((response) => {
    if (!response.ok) {
      throw new ApiError(
        response.originalError.message,
        response.problem,
        response.data?.code,
        response.data?.error,
      );
    }
  });

  // TODO: Move refresh token management to AuthApiInstance
  //
  // Refresh Token Management
  //

  ApiInstance.addAsyncResponseTransform(async (response) => {
    const cookieHeaders = (response.headers?.['Set-Cookie'] ?? response.headers?.['set-cookie']) as
      | string
      | string[]
      | undefined;

    if (!cookieHeaders) return;
    const cookies = Array.isArray(cookieHeaders) ? cookieHeaders : [cookieHeaders];

    const refreshTokenCookie = cookies.findLast(
      (cookieStr) => parseSetCookie(cookieStr).name === Config.refreshTokenCookieName,
    );
    if (!refreshTokenCookie) return;

    const cookie = parseSetCookie(refreshTokenCookie);

    // Max-Age has precedence over Expires
    let expiryDate: Date | null = null;
    if (cookie.maxAge) {
      expiryDate = new Date(Date.now() + cookie.maxAge * 1000);
    } else if (cookie.expires) {
      expiryDate = new Date(cookie.expires);
    }

    const isExpired = expiryDate && expiryDate.getTime() < Date.now();

    if (!cookie.value || isExpired) {
      // No value or expiryDate is in the past, remove the token
      await Storage.remove('refreshToken');
    }

    if (cookie.value) {
      await Storage.set('refreshToken', cookie.value);
    }
  });

  return ApiInstance;
};
