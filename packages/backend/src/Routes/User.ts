import {Password} from 'server-side';
import express from 'express';
import {ErrorCodes, HTTPStatus, Zod} from 'common';
import {Prisma, PrismaIncludes} from '../Services';
import {onlyAuthorized} from '../Middlewares';

const Router = express.Router();

Router.get('/me', onlyAuthorized, async (req, res) => {
  res.status(HTTPStatus.OK).send(res.locals.user);
});

Router.get('/username/:username', async (req, res) => {
  const {username} = req.params;

  const user = await Prisma.user.findUnique({where: {username}, include: PrismaIncludes.User});

  if (!user) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.UserNotFound});
    return;
  }

  res.status(HTTPStatus.OK).send(user);
});

Router.get('/:id', async (req, res) => {
  const {id} = req.params;

  const user = await Prisma.user.findUnique({where: {id}, include: PrismaIncludes.User});

  if (!user) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.UserNotFound});
    return;
  }

  res.status(HTTPStatus.OK).send(user);
});

Router.put('/', async (req, res) => {
  const body = Zod.User.Create.safeParse(req.body);

  if (!body.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: body.error});
    return;
  }

  const usernameExists = await Prisma.user.findUnique({where: {username: body.data.username}});
  if (usernameExists) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.UsernameAlreadyExists});
    return;
  }

  const emailExists = await Prisma.user.findUnique({where: {email: body.data.email}});
  if (emailExists) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.EmailAlreadyExists});
    return;
  }

  const user = await Prisma.user.create({
    data: {
      ...body.data,
      password: await Password.hash(body.data.password),
    },
  });

  res.status(HTTPStatus.OK).send(user);
});

export default Router;
