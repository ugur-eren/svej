import ApiInstance from '../ApiInstance';

export type ChatMessage = (Awaited<
  ReturnType<ReturnType<typeof ApiInstance.chats>['messages']['get']>
> & {error: null})['data'][number];

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
