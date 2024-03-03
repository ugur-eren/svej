import express from 'express';
import {HTTPStatus} from 'common';
import {Prisma, PrismaIncludes} from '../Services';
import {onlyAuthorized} from '../Middlewares';

const Router = express.Router();

Router.get('/', onlyAuthorized, async (req, res) => {
  const chats = await Prisma.chatMessage.findMany({
    where: {
      OR: [{fromId: res.locals.user.id}, {toId: res.locals.user.id}],
    },
    distinct: ['toId', 'fromId'],
  });

  const chatUserIds = chats.map((chat) =>
    chat.fromId !== res.locals.user.id ? chat.fromId : chat.toId,
  );

  const users = await Prisma.user.findMany({
    where: {id: {in: chatUserIds}},
    include: {
      ...PrismaIncludes.Author(res.locals.user.id),
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

  res.status(HTTPStatus.OK).send(result);
});

Router.get('/:userId', onlyAuthorized, async (req, res) => {
  const {userId} = req.params;

  const messages = await Prisma.chatMessage.findMany({
    where: {
      OR: [
        {
          AND: [{fromId: res.locals.user.id}, {toId: userId}],
        },
        {
          AND: [{fromId: userId}, {toId: res.locals.user.id}],
        },
      ],
    },
    orderBy: {createdAt: 'desc'},
  });

  res.status(HTTPStatus.OK).send(messages);
});

export default Router;
