import {Config} from '@svej/common';
import {parseSetCookie} from 'cookie';
import Storage from '../Utils/Storage';
import {createApiInstance} from './CreateApiInstance';

const AuthApiInstance = createApiInstance();

//
// Refresh Token Management
//

AuthApiInstance.addAsyncResponseTransform(async (response) => {
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

export default AuthApiInstance;
