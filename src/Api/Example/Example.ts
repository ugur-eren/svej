import ApiInstance from '../ApiInstance';
import {Response} from '../Types';
import {GetResponse, PostRequest, PostResponse} from './Example.types';

export const get = (): Response<GetResponse> => {
  return ApiInstance.get('/example/endpoint');
};

export const post = (params: PostRequest): Response<PostResponse> => {
  return ApiInstance.post('/example/endpoint', params);
};
