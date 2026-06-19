import {Config} from '@svej/common';
import type {App} from '@svej/backend';
import {treaty, Treaty} from '@elysia/eden';
import {parseSetCookie} from 'cookie';
import Storage from '@/Utils/Storage';
import {DEFAULT_BASE_URL, DEFAULT_HEADERS, fetchWithAuth} from './Utils';

export const createAuthApiInstance = (config?: Treaty.Config) => {
  const apiInstance = treaty<App>(DEFAULT_BASE_URL, {
    ...config,
    headers: {
      ...DEFAULT_HEADERS,
      ...config?.headers,
    },
    throwHttpError: false,
    parseDate: false,
    fetcher: async (input, init) => {
      const response = await fetchWithAuth(input, init);

      // Pass through unsuccessful responses
      if (!response.ok) return response;

      const cookieHeaders: string[] = [];
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          cookieHeaders.push(value);
        }
      });

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
    },
  });

  return apiInstance.auth;
};

const AuthApiInstance = createAuthApiInstance();

export default AuthApiInstance;
