import express from 'express';
import {JWT, Password} from 'server-side';
import {ErrorCodes, HTTPStatus, Zod} from 'common';
import {v4 as uuid} from 'uuid';
import {Prisma, PrismaIncludes} from '../Services';
import {onlyAuthorized} from '../Middlewares';
import type {ReqBody} from '../types';

const Router = express.Router();

Router.post('/login', async (req, res) => {
  const body = Zod.Auth.Login.safeParse(req.body);

  if (!body.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: body.error});
    return;
  }

  const {username, password} = body.data;

  const user = await Prisma.user.findUnique({where: {username}, include: PrismaIncludes.User('')});

  if (!user || !user.active) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.UserNotFound});
    return;
  }

  const passwordMatched = await Password.verify(password, user.password());
  if (!passwordMatched) {
    res.status(HTTPStatus.Unauthorized).send({code: ErrorCodes.WrongPassword});
    return;
  }

  const jti = uuid();

  // Using jti whitelist instead of blacklist
  await Prisma.user.update({where: {id: user.id}, data: {jtis: {push: jti}}});

  const result = await JWT.sign({sub: user.id, jti});

  if (result.ok) {
    res.status(HTTPStatus.OK).send({token: result.token, user});
  } else {
    res.status(HTTPStatus.InternalServerError).send({code: ErrorCodes.UnknownError});
  }
});

Router.post('/logout', onlyAuthorized, async (req, res) => {
  const {decoded, user} = res.locals;

  // Using jti whitelist instead of blacklist
  await Prisma.user.update({
    where: {id: decoded.sub},
    data: {jtis: {set: user.jtis().filter((jti: string) => jti !== decoded.jti)}},
  });

  res.status(HTTPStatus.OK).send({ok: true});
});

Router.post('/verify', async (req: ReqBody<{token: string}>, res) => {
  const {token} = req.body;

  if (!token) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.NoTokenInput});
    return;
  }

  const result = await JWT.verify(token);

  if (result.ok) {
    res.status(HTTPStatus.OK).send({ok: true});
  } else {
    res
      .status(HTTPStatus.Unauthorized)
      .send({code: ErrorCodes.InvalidAuthToken, error: result.error});
  }
});

export default Router;
