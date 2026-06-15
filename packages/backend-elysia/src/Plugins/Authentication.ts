import {HTTPStatus, ErrorCodes, SessionUser} from '@svej/common';
import {JWT} from '@svej/server-side';
import {Elysia} from 'elysia';

export const onlyAuthenticated = new Elysia().resolve({as: 'global'}, async ({status, headers}) => {
  const auth = headers.authorization;

  if (typeof auth !== 'string' || !auth.startsWith('Bearer ')) {
    return status(HTTPStatus.Unauthorized, {code: ErrorCodes.NoAuthToken});
  }

  const token = auth.slice(7);

  const result = await JWT.verify<{user: SessionUser}>(token);

  if (!result.ok) {
    return status(HTTPStatus.Unauthorized, {
      code: ErrorCodes.Unauthorized,
      error: result.error,
    });
  }

  const {user, ...decoded} = result.decoded;

  return {
    session: {
      user,
      token,
      decoded,
    },
  };
});
