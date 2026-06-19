import {ErrorCodes, HTTPStatus, Zod} from '@svej/common';
import {JWTAuth, Password, Prisma} from '@svej/server-side';
import {Prisma as PrismaTypes} from '@svej/database';
import {Elysia} from 'elysia';
import {onlyAuthenticated} from '@/Plugins';

export default new Elysia({prefix: '/credentials'})
  .post(
    '/login',
    async ({status, body, cookie}) => {
      const user = await Prisma.user.findUnique({
        where: {username: body.username},
        select: {id: true, active: true, password: true},
      });

      if (!user || !user.active) {
        return status(HTTPStatus.NotFound, {code: ErrorCodes.UserNotFound});
      }

      const passwordMatched = await Password.verify(body.password, user.password);
      if (!passwordMatched) {
        return status(HTTPStatus.Unauthorized, {code: ErrorCodes.WrongPassword});
      }

      const result = await JWTAuth.login(cookie, user.id);
      if (!result) {
        return status(HTTPStatus.InternalServerError, {code: ErrorCodes.UnknownError});
      }

      return {accessToken: result.accessToken, user: result.user};
    },
    {
      body: Zod.Auth.Login,
    },
  )
  .post(
    '/register',
    async ({status, body, cookie}) => {
      try {
        const user = await Prisma.user.create({
          data: {
            username: body.username,
            email: body.email,
            fullname: body.fullname,
            password: await Password.hash(body.password),
          },
        });

        const result = await JWTAuth.login(cookie, user.id);
        if (!result) {
          return status(HTTPStatus.InternalServerError, {
            code: ErrorCodes.AccountCreatedButLoginFailed,
          });
        }

        return {accessToken: result.accessToken, user: result.user};
      } catch (error) {
        if (
          !(error instanceof PrismaTypes.PrismaClientKnownRequestError) ||
          error.code !== 'P2002'
        ) {
          throw error;
        }

        const target = error.meta?.target;
        if (!Array.isArray(target) || target.length === 0) throw error;

        if (target.includes(PrismaTypes.UserScalarFieldEnum.email)) {
          return status(HTTPStatus.BadRequest, {code: ErrorCodes.EmailAlreadyExists});
        }

        if (target.includes(PrismaTypes.UserScalarFieldEnum.username)) {
          return status(HTTPStatus.BadRequest, {code: ErrorCodes.UsernameAlreadyExists});
        }

        throw error;
      }
    },
    {
      body: Zod.Auth.Register,
    },
  )
  .guard({}, (app) =>
    app.use(onlyAuthenticated).post(
      '/change-password',
      async ({status, body, cookie, session}) => {
        const user = await Prisma.user.findUnique({
          where: {id: session.user.id},
          select: {password: true},
        });
        if (!user) {
          return status(HTTPStatus.NotFound, {code: ErrorCodes.UserNotFound});
        }

        const verified = await Password.verify(body.currentPassword, user.password);
        if (!verified) {
          return status(HTTPStatus.BadRequest, {code: ErrorCodes.WrongPassword});
        }

        await Prisma.$transaction([
          Prisma.user.update({
            where: {id: session.user.id},
            data: {
              password: await Password.hash(body.newPassword),
            },
          }),
          Prisma.session.deleteMany({
            where: {userId: session.user.id},
          }),
        ]);

        const result = await JWTAuth.login(cookie, session.user.id);
        if (!result) {
          return status(HTTPStatus.InternalServerError, {code: ErrorCodes.UnknownError});
        }

        return {accessToken: result.accessToken, user: result.user};
      },
      {body: Zod.Auth.ChangePassword},
    ),
  );
