import ApiInstance from '../ApiInstance';
import {Response} from '../Types';
import * as ApiTypes from './Chat.types';

export const getChats = (): Response<ApiTypes.ChatUser[]> => {
  return ApiInstance.get('/chat');
};

export const getChatMessages = (userId: string): Response<ApiTypes.ChatMessage[]> => {
  return ApiInstance.get(`/chat/${userId}`);
};
