/* eslint-disable no-param-reassign */

import {Server} from 'socket.io';
import {ErrorCodes, SessionUser} from '@svej/common';
import {JWT} from '@svej/server-side';
import {WSError} from '../types';

export const onlyAuthorized: Parameters<Server['use']>[0] = async (socket, next) => {
  const token = socket.handshake.auth?.token;

  try {
    if (!token) {
      next(new WSError(ErrorCodes.NoAuthToken));
      return;
    }

    const result = await JWT.verify<{user: SessionUser}>(token);

    if (!result.ok) {
      next(new WSError(ErrorCodes.Unauthorized, result.error));
      return;
    }

    const {user, ...decoded} = result.decoded;

    socket.data.user = user;
    socket.data.decoded = decoded;

    if (decoded.exp) {
      const timeout = setTimeout(
        () => {
          socket.disconnect(true);
        },
        decoded.exp * 1_000 - Date.now(),
      );
      timeout.unref();

      socket.once('disconnect', () => {
        clearTimeout(timeout);
      });
    }

    next();
  } catch (error) {
    next(new WSError(ErrorCodes.InvalidAuthToken, error as Error));
  }
};
