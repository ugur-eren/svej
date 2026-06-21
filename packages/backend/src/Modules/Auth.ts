import {ErrorCodes} from '@svej/common';
import {JWTAuth, Password, Prisma} from '@svej/server-side';
import type {Cookie} from 'elysia';
import {ModuleError} from '@/Utils/Error';
import {UsersModule} from './Users';
import {assertUserExists} from './Internal/Assert';

export const AuthModule = {
  async credentialsLogin(
    cookie: Record<string, Cookie<unknown>>,
    username: string,
    password: string,
  ) {
    const user = await Prisma.user.findUnique({
      where: {username},
      select: {id: true, active: true, password: true},
    });

    assertUserExists(user);

    const passwordMatched = await Password.verify(password, user.password);
    if (!passwordMatched) {
      throw new ModuleError(ErrorCodes.WrongPassword);
    }

    return JWTAuth.login(cookie, user.id);
  },

  async credentialsRegister(
    cookie: Record<string, Cookie<unknown>>,
    data: {
      username: string;
      email: string;
      password: string;
      fullname?: string;
    },
  ) {
    const user = await UsersModule.create({
      username: data.username,
      email: data.email,
      fullname: data.fullname,
      password: await Password.hash(data.password),
    });

    return JWTAuth.login(cookie, user.id);
  },

  async credentialsChangePassword(
    cookie: Record<string, Cookie<unknown>>,
    viewerId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await Prisma.user.findUnique({
      where: {id: viewerId},
      select: {password: true},
    });

    assertUserExists(user);

    const verified = await Password.verify(currentPassword, user.password);
    if (!verified) {
      throw new ModuleError(ErrorCodes.WrongPassword);
    }

    await Prisma.$transaction([
      Prisma.user.update({
        where: {id: viewerId},
        data: {
          password: await Password.hash(newPassword),
        },
      }),
      Prisma.session.deleteMany({
        where: {userId: viewerId},
      }),
    ]);

    return JWTAuth.login(cookie, viewerId);
  },
};
