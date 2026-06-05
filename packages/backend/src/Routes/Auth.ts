import express from 'express';
import {JWTAuth, Password} from '@svej/server-side';
import {ErrorCodes, HTTPStatus, Zod} from '@svej/common';
import {Prisma} from '../Services';
import {onlyAuthorized} from '../Middlewares';

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

Router.post('/logout', onlyAuthorized, async (req, res) => {
  await JWTAuth.logout();

  res.status(HTTPStatus.OK).send({ok: true});
});

Router.post('/refresh', async (req, res) => {
  const result = await JWTAuth.rotateTokens();

  if (!result) {
    res.status(HTTPStatus.Unauthorized).send({code: ErrorCodes.InvalidAuthToken});
    return;
  }

  res.status(HTTPStatus.OK).send({accessToken: result.accessToken, user: result.user});
});

export default Router;
