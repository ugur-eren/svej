import {Config} from '@svej/common';
import {ApisauceConfig, PROBLEM_CODE, create} from 'apisauce';
import {parseSetCookie} from 'cookie';
import Env from '../Utils/Env';
import {store} from '../Redux';
import Storage from '../Utils/Storage';

const ApiOptions: ApisauceConfig = {
  baseURL: Env.SVEJ_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const ApiInstance = create(ApiOptions);

export class ApiError extends Error {
  public message: string;
  public problemCode: PROBLEM_CODE;
  public code?: string;
  public error?: object;

  constructor(message: string, problemCode: PROBLEM_CODE, code?: string, error?: object) {
    super(message);

    this.message = message;
    this.problemCode = problemCode;
    this.code = code;
    this.error = error;
  }
}

ApiInstance.addRequestTransform(async (request) => {
  const token = store.getState().auth.accessToken;

  request.headers = {
    ...request.headers,
    Authorization: token ? `Bearer ${token}` : undefined,
  };
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

export default ApiInstance;
