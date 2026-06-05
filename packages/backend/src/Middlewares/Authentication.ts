import express from 'express';
import type * as core from 'express-serve-static-core';
import {JWT} from '@svej/server-side';
import {HTTPStatus, ErrorCodes, SessionUser} from '@svej/common';

type JWTReturnType = JWT.VerifyReturnType<{user: SessionUser}> & {ok: true};

type Locals = {
  authenticated?: boolean;
  decoded: Omit<JWTReturnType['decoded'], 'user'>;
  token: string;
  user: SessionUser;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      authenticated?: boolean;
      decoded: Omit<JWTReturnType['decoded'], 'user'>;
      token: string;
      user: SessionUser;
    }
  }
}

export const onlyAuthorized = async <
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  LocalsObj extends Locals = Locals,
>(
  req: express.Request<P, ResBody, ReqBody, ReqQuery>,
  res: express.Response<ResBody, LocalsObj>,
  next: express.NextFunction,
): Promise<void> => {
  const {authorization} = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(HTTPStatus.Unauthorized).send({code: ErrorCodes.NoAuthToken} as any);
    return;
  }

  const token = authorization.split(' ')[1];

  const result = await JWT.verify<{user: SessionUser}>(token);

  if (!result.ok) {
    res.status(HTTPStatus.Unauthorized).send({
      code: ErrorCodes.Unauthorized,
      error: result.error,
    } as any);
    return;
  }

  const {user, ...decoded} = result.decoded;

  res.locals.authenticated = true;
  res.locals.decoded = decoded;
  res.locals.token = token;
  res.locals.user = user;

  next();
};
