import {Config} from '@svej/common';
import {stringifyCookie} from 'cookie';
import ApiInstance from '../ApiInstance';
import {Response} from '../Types';
import * as ApiTypes from './Auth.types';

export const login = (data: ApiTypes.LoginRequest): Response<ApiTypes.LoginResponse> => {
  return ApiInstance.post('/auth/login', data);
};

export const logout = (refreshToken: string): Response<ApiTypes.LogoutResponse> => {
  return ApiInstance.post('/auth/logout', undefined, {
    headers: {
      Cookie: stringifyCookie({[Config.refreshTokenCookieName]: refreshToken}),
    },
  });
};

export const refresh = (refreshToken: string): Response<ApiTypes.RefreshResponse> => {
  return ApiInstance.post('/auth/refresh', undefined, {
    headers: {
      Cookie: stringifyCookie({[Config.refreshTokenCookieName]: refreshToken}),
    },
  });
};
