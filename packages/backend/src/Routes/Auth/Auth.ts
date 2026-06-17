import {ErrorCodes, HTTPStatus} from '@svej/common';
import {JWTAuthElysia} from '@svej/server-side';
import {Elysia} from 'elysia';

export default new Elysia()
  .post('/logout', async ({cookie}) => {
    await JWTAuthElysia.logout(cookie);

    return {ok: true};
  })
  .post('/refresh', async ({status, cookie}) => {
    const result = await JWTAuthElysia.rotateTokens(cookie);

    if (!result) {
      return status(HTTPStatus.Unauthorized, {code: ErrorCodes.InvalidAuthToken});
    }

    return {accessToken: result.accessToken, user: result.user};
  });
