import ApiInstance from '../ApiInstance';
import {Response} from '../Types';
import * as ApiTypes from './Comment.types';

export const getById = (id: string): Response<ApiTypes.Comment> => {
  return ApiInstance.get(`/comment/${id}`);
};

export const getByPostId = (id: string): Response<ApiTypes.Comment[]> => {
  return ApiInstance.get(`/comment/post/${id}`);
};

export const getReactionCounts = (id: string): Response<ApiTypes.ReactionCounts> => {
  return ApiInstance.get(`/comment/${id}/reactions`);
};

export const doReaction = (
  id: string,
  type: ApiTypes.ReactionType,
): Response<ApiTypes.ReactionCounts> => {
  return ApiInstance.post(`/comment/${id}/reactions/${type}`);
};

export const create = (data: ApiTypes.CreateRequest): Response<ApiTypes.CreateResponse> => {
  return ApiInstance.put('/comment', data);
};
