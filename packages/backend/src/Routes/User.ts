import {Password} from 'server-side';
import express from 'express';
import {Config, ErrorCodes, HTTPStatus} from 'common';
import {z} from 'zod';
import {Prisma, PrismaIncludes} from '../Services';

const Router = express.Router();

Router.get('/:id', async (req, res) => {
  const {id} = req.params;

  const user = await Prisma.user.findUnique({where: {id}, include: PrismaIncludes.User});

  if (!user) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.UserNotFound});
    return;
  }

  res.status(HTTPStatus.OK).send(user);
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

Router.put('/', async (req, res) => {
  const User = z.object({
    username: z.string().trim().min(Config.usernameMinLength).max(Config.usernameMaxLength),
    fullname: z.string().trim().optional(),
    email: z.string().trim().email(),
    password: z.string().min(Config.passwordMinLength).max(Config.passwordMaxLength),
  });

  const user = User.safeParse(req.body);

  if (!user.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: user.error});
    return;
  }

  const createdUser = await Prisma.user.create({
    data: {
      ...user.data,
      password: await Password.hash(user.data.password),
    },
  });

  res.status(HTTPStatus.OK).send(createdUser);
});

export default Router;
