import {Prisma, PrismaIncludes} from '@svej/server-side';
import {Config} from '@svej/common';
import {assertConversationExists} from './Internal/Assert';

export const ChatsModule = {
  async getAllConversations(viewerId: string, cursor?: string) {
    const conversations = await Prisma.conversation.findMany({
      skip: cursor ? 1 : 0,
      take: Config.conversationsPerPage,
      cursor: cursor ? {id: cursor} : undefined,
      where: {
        OR: [{user1Id: viewerId}, {user2Id: viewerId}],
      },
      include: PrismaIncludes.Conversation(viewerId),
      orderBy: [{lastMessageAt: 'desc'}, {id: 'desc'}],
    });

    const lastConversation = conversations[conversations.length - 1];
    const nextCursor = lastConversation ? lastConversation.id : undefined;

    return {
      conversations: conversations.map((conversation) => ({
        ...conversation,
        lastMessage: conversation.messages.length ? conversation.messages[0] : null,
        participant: conversation.user1Id === viewerId ? conversation.user2 : conversation.user1,
      })),
      nextCursor,
    };
  },

  async getConversationByParticipant(viewerId: string, participantId: string) {
    const [user1Id, user2Id] = [viewerId, participantId].sort();

    const conversation = await Prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
      include: PrismaIncludes.Conversation(viewerId),
    });

    return conversation;
  },

  async getOrCreateConversationByParticipant(viewerId: string, participantId: string) {
    const [user1Id, user2Id] = [viewerId, participantId].sort();

    let conversation;
    try {
      conversation = await Prisma.conversation.create({
        data: {user1Id, user2Id},
        include: PrismaIncludes.Conversation(viewerId),
      });
    } catch {
      conversation = await this.getConversationByParticipant(viewerId, participantId);
    }

    assertConversationExists(conversation);

    return conversation;
  },

  async getConversationById(viewerId: string, conversationId: string) {
    const conversation = await Prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: PrismaIncludes.Conversation(viewerId),
    });

    assertConversationExists(conversation);

    return conversation;
  },

  async getConversationMessages(viewerId: string, conversationId: string, cursor?: string) {
    const messages = await Prisma.chatMessage.findMany({
      skip: cursor ? 1 : 0,
      take: Config.chatMessagesPerPage,
      cursor: cursor ? {id: cursor} : undefined,
      where: {
        conversationId,
      },
      orderBy: [{createdAt: 'desc'}, {id: 'desc'}],
    });

    const lastMessage = messages[messages.length - 1];
    const nextCursor = lastMessage ? lastMessage.id : undefined;

    return {
      messages,
      nextCursor,
    };
  },
};
