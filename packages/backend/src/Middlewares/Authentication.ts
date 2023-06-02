import express from 'express';
import {ErrorCodes} from 'common';
import {Prisma} from '../Services';
import HTTPStatus from '../Utils/HTTPStatus';
import {verify} from '../Utils/JWT';

export const onlyAuthorized = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  const {authorization} = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(HTTPStatus.Unauthorized).send({code: ErrorCodes.NoAuthToken});
    return;
  }

  const token = authorization.split(' ')[1];

  const result = await verify(token);

  if (!result.ok) {
    res
      .status(HTTPStatus.Unauthorized)
      .send({code: ErrorCodes.InvalidAuthToken, error: result.error});
    return;
  }

  if (typeof result.decoded !== 'object' || !result.decoded.sub) {
    res.status(HTTPStatus.Unauthorized).send({code: ErrorCodes.InvalidAuthToken});
    return;
  }

  const user = await Prisma.user.findUnique({
    where: {
      id: result.decoded.sub,
    },
  });

  if (!user || !user.id || !user.active) {
    res.status(HTTPStatus.Unauthorized).send({code: ErrorCodes.Unauthorized});
    return;
  }

  res.locals.authenticated = true;
  res.locals.decoded = result.decoded;
  res.locals.token = token;
  res.locals.user = user;

  next();
};
