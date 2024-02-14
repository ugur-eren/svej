import ApiInstance from '../ApiInstance';
import {Response} from '../Types';
import * as ApiTypes from './Auth.types';

export const login = (data: ApiTypes.LoginRequest): Response<ApiTypes.LoginResponse> => {
  return ApiInstance.post('/auth/login', data);
};

export const logout = (): Response<ApiTypes.LogoutResponse> => {
  return ApiInstance.post('/auth/logout');
};

export const verify = (data: ApiTypes.VerifyRequest): Response<ApiTypes.VerifyResponse> => {
  return ApiInstance.post('/auth/verify', data);
};
