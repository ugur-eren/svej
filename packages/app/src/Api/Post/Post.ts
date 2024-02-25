import type {AxiosRequestConfig} from 'axios';
import ApiInstance from '../ApiInstance';
import {Response} from '../Types';
import * as ApiTypes from './Post.types';

export const getAll = (): Response<ApiTypes.Post[]> => {
  return ApiInstance.get('/post');
};

export const getExplore = (beforeDate?: string): Response<ApiTypes.Post[]> => {
  return ApiInstance.get('/post/explore', {beforeDate});
};

export const getByUserId = (userId: string, beforeDate?: string): Response<ApiTypes.Post[]> => {
  return ApiInstance.get(`/post/user/${userId}`, {beforeDate});
};

export const getById = (id: string): Response<ApiTypes.Post> => {
  return ApiInstance.get(`/post/${id}`);
};

export const getReactionCounts = (id: string): Response<ApiTypes.ReactionCounts> => {
  return ApiInstance.get(`/post/${id}/reactions`);
};

export const doReaction = (
  id: string,
  type: ApiTypes.ReactionType,
): Response<ApiTypes.ReactionCounts> => {
  return ApiInstance.post(`/post/${id}/reactions/${type}`);
};

export const createPost = (
  data: ApiTypes.CreateBody,
  config?: AxiosRequestConfig,
): Response<ApiTypes.CreateResponse> => {
  const formData = new FormData();

  formData.append('description', data.description);

  data.medias.forEach((media, index) => {
    formData.append(`medias`, {
      uri: media.uri,
      name: `medias[${index}]`,
      type: media.mimeType,
    });
  });

  return ApiInstance.put('/post', formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config?.headers,
    },
  });
};
