import {Server} from 'socket.io';
import {ErrorCodes} from 'common';
import {JWT} from 'server-side';
import {WSError} from '../types';

export const onlyAuthorized: Parameters<Server['use']>[0] = async (socket, next) => {
  // const token = socket.handshake.auth?.token;
  const token = socket.handshake.headers?.authorization;

  if (!token) {
    next(new WSError(ErrorCodes.NoTokenInput));
    return;
  }

  const result = await JWT.verify(token);

  if (!result.ok) {
    if (result.cause === 'Unauthorized') {
      next(new WSError(ErrorCodes.Unauthorized));
      return;
    }

    next(new WSError(ErrorCodes.InvalidAuthToken, result.error));
    return;
  }

  socket.data = {
    user: result.user,
  };

  next();
};
