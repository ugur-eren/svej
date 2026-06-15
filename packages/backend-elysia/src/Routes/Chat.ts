import {PrismaIncludes} from '@svej/database';
import {Elysia} from 'elysia';
import {z} from 'zod';
import {Prisma} from '@/Services';
import {onlyAuthenticated} from '@/Plugins';

export default new Elysia({prefix: '/chat'})
  .use(onlyAuthenticated)
  .get('/', async ({session}) => {
    // TODO: optimize this query
    const chats = await Prisma.chatMessage.findMany({
      where: {
        OR: [{fromId: session.user.id}, {toId: session.user.id}],
      },
      distinct: ['toId', 'fromId'],
    });

    const chatUserIds = chats.map((chat) =>
      chat.fromId !== session.user.id ? chat.fromId : chat.toId,
    );

    const users = await Prisma.user.findMany({
      where: {id: {in: chatUserIds}},
      include: {
        ...PrismaIncludes.Author(session.user.id),
        chatMessageSent: {
          take: 1,
          orderBy: {createdAt: 'desc'},
        },
        chatMessageReceived: {
          take: 1,
          orderBy: {createdAt: 'desc'},
        },
      },
    });

    const result = users.map((user) => {
      const lastMessage =
        user.chatMessageSent?.[0]?.createdAt > user.chatMessageReceived?.[0]?.createdAt
          ? user.chatMessageSent?.[0]
          : user.chatMessageReceived?.[0];

      return {
        ...user,
        lastMessage,
      };
    });

    return result;
  })
  .get(
    '/:userId',
    async ({session, params: {userId}}) => {
      // TODO: pagination
      const messages = await Prisma.chatMessage.findMany({
        where: {
          OR: [
            {
              AND: [{fromId: session.user.id}, {toId: userId}],
            },
            {
              AND: [{fromId: userId}, {toId: session.user.id}],
            },
          ],
        },
        orderBy: {createdAt: 'desc'},
      });

      return messages;
    },
    {
      params: z.object({userId: z.uuid()}),
    },
  );
