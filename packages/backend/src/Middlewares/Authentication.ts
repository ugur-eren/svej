import express from 'express';
import {JWT} from 'server-side';
import {HTTPStatus, ErrorCodes} from 'common';
import {User} from 'database';

type Locals = {
  authenticated?: boolean;
  decoded: JWT.JwtPayload;
  token: string;
  user: User;
};

export const onlyAuthorized = async (
  req: express.Request,
  res: express.Response<unknown, Locals>,
  next: express.NextFunction,
): Promise<void> => {
  const {authorization} = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(HTTPStatus.Unauthorized).send({code: ErrorCodes.NoAuthToken});
    return;
  }

  const token = authorization.split(' ')[1];

  const result = await JWT.verify(token);

  if (!result.ok) {
    res.status(HTTPStatus.Unauthorized).send({
      code: result.cause === 'Unauthorized' ? ErrorCodes.Unauthorized : ErrorCodes.InvalidAuthToken,
      error: result.error,
    });
    return;
  }

  res.locals.authenticated = true;
  res.locals.decoded = result.decoded;
  res.locals.token = token;
  res.locals.user = result.user;

  next();
};
