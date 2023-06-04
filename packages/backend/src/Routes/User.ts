import express from 'express';
import {Config} from 'common';
import {z} from 'zod';
import bcrypt from 'bcrypt';
import {Prisma, PrismaTypes} from '../Services';
import HTTPStatus from '../Utils/HTTPStatus';
import {BCRYPT_ROUNDS} from '../Utils/Env';

const Router = express.Router();

const findUser = async (where: PrismaTypes.UserWhereUniqueInput) => {
  return Prisma.user.findUnique({where, include: {profilePhoto: true, coverPhoto: true}});
};

Router.get('/:id', async (req, res) => {
  const {id} = req.params;

  const user = await findUser({id});

  if (!user) {
    res.status(HTTPStatus.NotFound).send('User not found');
    return;
  }

  res.status(HTTPStatus.OK).send(user);
});

Router.get('/username/:username', async (req, res) => {
  const {username} = req.params;

  const user = await findUser({username});

  if (!user) {
    res.status(HTTPStatus.NotFound).send('User not found');
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
    res.status(HTTPStatus.BadRequest).send(user.error);
    return;
  }

  const createdUser = await Prisma.user.create({
    data: {
      ...user.data,
      password: await bcrypt.hash(user.data.password, BCRYPT_ROUNDS),
    },
  });

  res.status(HTTPStatus.OK).send(createdUser);
});

export default Router;
