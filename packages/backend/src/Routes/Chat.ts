import express from 'express';
import {HTTPStatus} from 'common';
import {Prisma} from '../Services';
import {onlyAuthorized} from '../Middlewares';

const Router = express.Router();

Router.get('/', onlyAuthorized, async (req, res) => {
  const chats = await Prisma.chatMessage.findMany({
    where: {
      OR: [{fromId: res.locals.user.id}, {toId: res.locals.user.id}],
    },
    distinct: ['toId', 'fromId'],
    include: {from: true, to: true},
    orderBy: {createdAt: 'desc'},
  });

  const filteredChats = chats.filter(
    (chat) => chat.fromId !== res.locals.user.id && chat.toId !== res.locals.user.id,
  );

  res.status(HTTPStatus.OK).send(filteredChats);
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
