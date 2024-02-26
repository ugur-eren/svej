import express from 'express';
import {Config, ErrorCodes, HTTPStatus} from 'common';
import {Prisma, PrismaIncludes} from '../Services';
import {onlyAuthorized} from '../Middlewares';
import {getBeforeDate} from '../Utils/Helpers';

const Router = express.Router();

Router.get('/', onlyAuthorized, async (req, res) => {
  const beforeDate = getBeforeDate(req.query.beforeDate);

  const notifications = await Prisma.notification.findMany({
    include: PrismaIncludes.Notification(res.locals.user.id),
    take: Config.notificationsPerPage,
    where: {ownerId: res.locals.user.id, createdAt: {lt: beforeDate}},
    orderBy: {createdAt: 'desc'},
  });

  res.status(HTTPStatus.OK).send(notifications);
});

Router.get('/count', onlyAuthorized, async (req, res) => {
  const count = await Prisma.notification.count({where: {ownerId: res.locals.user.id}});

  res.status(HTTPStatus.OK).send({count});
});

Router.get('/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const notification = await Prisma.notification.findUnique({
    where: {id},
    include: PrismaIncludes.Notification(res.locals.user.id),
  });

  if (!notification) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.NotificationNotFound});
    return;
  }

  res.status(HTTPStatus.OK).send(notification);
});

export default Router;
