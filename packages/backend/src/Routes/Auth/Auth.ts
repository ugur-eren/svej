import {ErrorCodes, HTTPStatus} from '@svej/common';
import {JWTAuth} from '@svej/server-side';
import {Elysia} from 'elysia';

export default new Elysia()
  .post('/logout', async ({cookie}) => {
    await JWTAuth.logout(cookie);

    return {ok: true};
  })
  .post('/refresh', async ({status, cookie}) => {
    const result = await JWTAuth.rotateTokens(cookie);

    if (!result) {
      return status(HTTPStatus.Unauthorized, {code: ErrorCodes.InvalidAuthToken});
    }

    return {accessToken: result.accessToken, user: result.user};
  });
