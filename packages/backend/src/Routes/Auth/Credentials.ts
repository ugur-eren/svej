import express from 'express';
import {JWTAuth, Password} from '@svej/server-side';
import {ErrorCodes, HTTPStatus, Zod} from '@svej/common';
import {Prisma as PrismaTypes} from '@svej/database';
import {Prisma} from '../../Services';
import {onlyAuthorized} from '../../Middlewares';

const Router = express.Router();

Router.post('/login', async (req, res) => {
  const body = Zod.Auth.Login.safeParse(req.body);

  if (!body.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: body.error});
    return;
  }

  const {username, password} = body.data;

  const user = await Prisma.user.findUnique({
    where: {username},
    select: {id: true, active: true, password: true},
  });

  if (!user || !user.active) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.UserNotFound});
    return;
  }

  const passwordMatched = await Password.verify(password, user.password());
  if (!passwordMatched) {
    res.status(HTTPStatus.Unauthorized).send({code: ErrorCodes.WrongPassword});
    return;
  }

  const result = await JWTAuth.login(user.id);
  if (!result) {
    res.status(HTTPStatus.InternalServerError).send({code: ErrorCodes.UnknownError});
    return;
  }

  res.status(HTTPStatus.OK).send({accessToken: result.accessToken, user: result.user});
});

Router.post('/register', async (req, res) => {
  const body = Zod.Auth.Register.safeParse(req.body);

  if (!body.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: body.error});
    return;
  }

  try {
    const user = await Prisma.user.create({
      data: {
        ...body.data,
        password: await Password.hash(body.data.password),
      },
    });

    const result = await JWTAuth.login(user.id);
    if (!result) {
      res
        .status(HTTPStatus.InternalServerError)
        .send({code: ErrorCodes.AccountCreatedButLoginFailed});
      return;
    }

    res.status(HTTPStatus.OK).send({accessToken: result.accessToken, user: result.user});
  } catch (error) {
    if (!(error instanceof PrismaTypes.PrismaClientKnownRequestError) || error.code !== 'P2002') {
      throw error;
    }

    const target = error.meta?.target;
    if (!Array.isArray(target) || target.length === 0) throw error;

    if (target.includes(PrismaTypes.UserScalarFieldEnum.email)) {
      res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.EmailAlreadyExists});
      return;
    }

    if (target.includes(PrismaTypes.UserScalarFieldEnum.username)) {
      res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.UsernameAlreadyExists});
      return;
    }

    throw error;
  }
});

Router.post('/change-password', onlyAuthorized, async (req, res) => {
  const body = Zod.Auth.ChangePassword.safeParse(req.body);

  if (!body.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: body.error});
    return;
  }

  const user = await Prisma.user.findUnique({
    where: {id: res.locals.user.id},
    select: {password: true},
  });
  if (!user) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.UserNotFound});
    return;
  }

  const verified = await Password.verify(body.data.currentPassword, user.password());
  if (!verified) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.WrongPassword});
    return;
  }

  await Prisma.user.update({
    where: {id: res.locals.user.id},
    data: {
      password: await Password.hash(body.data.newPassword),
      jtis: {
        set: [],
      },
    },
  });

  const result = await JWTAuth.login(res.locals.user.id);
  if (!result) {
    res.status(HTTPStatus.InternalServerError).send({code: ErrorCodes.UnknownError});
    return;
  }

  res.status(HTTPStatus.OK).send({accessToken: result.accessToken, user: result.user});
});

export default Router;
