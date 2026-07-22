import {Config} from '@svej/common';
import {stringifyCookie} from 'cookie';
import AuthApiInstance from '../../AuthApiInstance';

export const logout = async (refreshToken: string) => {
  return AuthApiInstance.logout.post(undefined, {
    headers: {
      Cookie: stringifyCookie({[Config.refreshTokenCookieName]: refreshToken}),
    },
  });
};

export const refresh = async (refreshToken: string) => {
  return AuthApiInstance.refresh.post(undefined, {
    headers: {
      Cookie: stringifyCookie({[Config.refreshTokenCookieName]: refreshToken}),
    },
  });
};

export * as Credentials from './Credentials';
