import ApiInstance from '../ApiInstance';

export const getAllConversations = async () => {
  return ApiInstance.chats.get();
};

export const getConversationByParticipant = async (participantId: string) => {
  return ApiInstance.chats['by-participant']({participantId});
};

export const getOrCreateConversationByParticipant = async (participantId: string) => {
  return ApiInstance.chats.post({participantId});
};

export const getConversationById = async (conversationId: string) => {
  return ApiInstance.chats({conversationId}).get();
};

export const getConversationMessages = async (conversationId: string) => {
  return ApiInstance.chats({conversationId}).messages.get();
};
