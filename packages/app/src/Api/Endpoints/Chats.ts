import ApiInstance from '../ApiInstance';

export type ChatMessage = (Awaited<ReturnType<typeof getConversationMessages>> & {
  error: null;
})['data']['messages'][number];

export const getAllConversations = async (cursor?: string) => {
  return ApiInstance.chats.get({query: {cursor}});
};

export const getConversationByParticipant = async (participantId: string) => {
  return ApiInstance.chats['by-participant']({participantId}).get();
};

export const getOrCreateConversationByParticipant = async (participantId: string) => {
  return ApiInstance.chats.post({participantId});
};

export const getConversationById = async (conversationId: string) => {
  return ApiInstance.chats({conversationId}).get();
};

export const getConversationMessages = async (conversationId: string, cursor?: string) => {
  return ApiInstance.chats({conversationId}).messages.get({query: {cursor}});
};
