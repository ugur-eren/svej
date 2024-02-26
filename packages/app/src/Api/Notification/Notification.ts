import ApiInstance from '../ApiInstance';
import {Response} from '../Types';
import * as ApiTypes from './Notification.types';

export const getAll = (beforeDate?: string): Response<ApiTypes.Notification[]> => {
  return ApiInstance.get('/notification', {beforeDate});
};

export const getById = (id: string): Response<ApiTypes.Notification> => {
  return ApiInstance.get(`/notification/${id}`);
};
