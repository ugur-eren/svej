import {Config} from '@svej/common';
import {stringifyCookie} from 'cookie';
import AuthApiInstance from '../AuthApiInstance';

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

export const login = async (data: Parameters<typeof AuthApiInstance.credentials.login.post>[0]) => {
  return AuthApiInstance.credentials.login.post(data);
};

export const register = async (
  data: Parameters<typeof AuthApiInstance.credentials.register.post>[0],
) => {
  return AuthApiInstance.credentials.register.post(data);
};

export const changePassword = async (
  data: Parameters<(typeof AuthApiInstance.credentials)['change-password']['post']>[0],
) => {
  return AuthApiInstance.credentials['change-password'].post(data);
};
