import AuthApiInstance from '../../AuthApiInstance';
import {Response} from '../../Types';
import * as ApiTypes from './Credentials.types';

export const login = (data: ApiTypes.LoginRequest): Response<ApiTypes.LoginResponse> => {
  return AuthApiInstance.post('/auth/credentials/login', data);
};

export const register = (data: ApiTypes.RegisterRequest): Response<ApiTypes.RegisterResponse> => {
  return AuthApiInstance.post('/auth/credentials/register', data);
};

export const changePassword = (data: ApiTypes.ChangePasswordRequest): Response<null> => {
  return AuthApiInstance.post('/auth/credentials/change-password', data);
};
