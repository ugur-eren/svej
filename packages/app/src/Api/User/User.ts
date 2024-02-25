import ApiInstance from '../ApiInstance';
import {Response} from '../Types';
import * as ApiTypes from './User.types';

export const search = (query: string): Response<ApiTypes.SearchResponse> => {
  return ApiInstance.get(`/user/search`, {query});
};

export const getMe = (): Response<ApiTypes.User> => {
  return ApiInstance.get(`/user/me`);
};

export const getById = (id: string): Response<ApiTypes.User> => {
  return ApiInstance.get(`/user/${id}`);
};

export const getByUsername = (username: string): Response<ApiTypes.User> => {
  return ApiInstance.get(`/user/username/${username}`);
};

export const register = (data: ApiTypes.RegisterRequest): Response<ApiTypes.RegisterResponse> => {
  return ApiInstance.put('/user', data);
};
