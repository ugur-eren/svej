import ApiInstance from '../ApiInstance';
import {Response} from '../Types';
import * as ApiTypes from './Post.types';

export const getAll = (): Response<ApiTypes.Post[]> => {
  return ApiInstance.get('/post');
};

export const getById = (id: string): Response<ApiTypes.PostWithComments> => {
  return ApiInstance.get(`/post/${id}`);
};

export const getByUserId = (userId: string): Response<ApiTypes.Post[]> => {
  return ApiInstance.get(`/post/user/${userId}`);
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
