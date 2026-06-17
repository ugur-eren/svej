import {Prisma, PrismaIncludes} from '@/Services';
import {assertConversationExists} from './Internal/Assert';

export const ChatsModule = {
  async getAllConversations(viewerId: string) {
    const conversations = await Prisma.conversation.findMany({
      where: {
        OR: [{user1Id: viewerId}, {user2Id: viewerId}],
      },
      include: PrismaIncludes.Conversation(viewerId),
      orderBy: {lastMessageAt: 'desc'},
    });

    return conversations.map((conversation) => ({
      ...conversation,
      participant: conversation.user1Id === viewerId ? conversation.user2 : conversation.user1,
    }));
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
      conversation = await Prisma.conversation.findUnique({
        where: {
          user1Id_user2Id: {
            user1Id,
            user2Id,
          },
        },
        include: PrismaIncludes.Conversation(viewerId),
      });
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

  async getConversationMessages(viewerId: string, conversationId: string) {
    const messages = await Prisma.chatMessage.findMany({
      where: {
        conversationId,
      },
      orderBy: {createdAt: 'desc'},
    });

    return messages;
  },
};
