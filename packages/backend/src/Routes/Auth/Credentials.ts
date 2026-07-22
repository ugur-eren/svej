import {ErrorCodes, HTTPStatus, Zod} from '@svej/common';
import {Elysia} from 'elysia';
import {onlyAuthenticated} from '@/Plugins';
import {AuthModule} from '@/Modules/Auth';

export default new Elysia({prefix: '/credentials'})
  .post(
    '/login',
    async ({status, body, cookie}) => {
      const result = await AuthModule.credentialsLogin(cookie, body.username, body.password);

      if (!result) {
        return status(HTTPStatus.InternalServerError, {code: ErrorCodes.UnknownError});
      }

      return result;
    },
    {
      body: Zod.Auth.Login,
    },
  )
  .post(
    '/register',
    async ({status, body, cookie}) => {
      const result = await AuthModule.credentialsRegister(cookie, body);

      if (!result) {
        return status(HTTPStatus.InternalServerError, {
          code: ErrorCodes.AccountCreatedButLoginFailed,
        });
      }

      return result;
    },
    {
      body: Zod.Auth.Register,
    },
  )
  .guard({}, (app) =>
    app.use(onlyAuthenticated).post(
      '/change-password',
      async ({status, body, cookie, session}) => {
        const result = await AuthModule.credentialsChangePassword(
          cookie,
          session.user.id,
          body.currentPassword,
          body.newPassword,
        );

        if (!result) {
          return status(HTTPStatus.InternalServerError, {code: ErrorCodes.UnknownError});
        }

        return result;
      },
      {body: Zod.Auth.ChangePassword},
    ),
  );
