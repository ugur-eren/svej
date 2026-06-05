import crypto from 'node:crypto';
import {Config, SessionUser} from '@svej/common';
import {cookies, CookieManager, ResponseCookie} from './RequestContext';
import {sign, verify} from './JWT';
import Prisma from './Prisma';

const setRefreshTokenCookie = (cookieStore: CookieManager, refreshToken?: string) => {
  const config: Partial<ResponseCookie> = {
    path: '/auth',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: Config.jwtRefreshTokenTTL * 1_000,
    expires: new Date(Date.now() + Config.jwtRefreshTokenTTL * 1_000),
  };

  if (refreshToken) {
    cookieStore.set(Config.refreshTokenCookieName, refreshToken, config);
  } else {
    cookieStore.delete(Config.refreshTokenCookieName, config);
  }
};

const getAccessTokenPayload = async (
  userId: string,
): Promise<false | {sub: string; user: SessionUser}> => {
  const user = await Prisma.user.findUnique({
    where: {id: userId},
    select: {
      id: true,
      active: true,
      username: true,
      fullname: true,
      email: true,
      profilePhoto: {
        select: {
          id: true,
          fileKey: true,
        },
      },
      coverPhoto: {
        select: {
          id: true,
          fileKey: true,
        },
      },
    },
  });
  if (!user?.active) return false;

  return {
    sub: user.id,
    user,
  };
};

const getNewTokenPair = async (
  userId: string,
): Promise<false | {accessToken: string; refreshToken: string; user: SessionUser; jti: string}> => {
  const accessTokenPayload = await getAccessTokenPayload(userId);
  if (!accessTokenPayload) return false;
  const {sub, user} = accessTokenPayload;

  const accessToken = await sign({
    sub,
    exp: Math.floor(Date.now() / 1_000) + Config.jwtAccessTokenTTL,
    user,
  });
  if (!accessToken.ok) return false;

  const jti = crypto.randomUUID();

  const refreshToken = await sign({
    sub,
    jti,
    exp: Math.floor(Date.now() / 1_000) + Config.jwtRefreshTokenTTL,
  });
  if (!refreshToken.ok) return false;

  return {accessToken: accessToken.token, refreshToken: refreshToken.token, user, jti};
};

/**
 * Creates JWT token and sets session cookies for authenticated users.
 *
 * NOTE: This function will not do any validation or authentication.
 */
export const login = async (
  userId: string,
): Promise<false | {accessToken: string; user: SessionUser}> => {
  const newPair = await getNewTokenPair(userId);
  if (!newPair) return false;

  const {accessToken, refreshToken, user, jti} = newPair;

  try {
    await Prisma.user.update({
      where: {id: user.id},
      data: {
        jtis: {push: jti},
      },
    });
  } catch {
    return false;
  }

  const cookieStore = cookies();
  setRefreshTokenCookie(cookieStore, refreshToken);

  return {accessToken, user};
};

/**
 * Logs out the current user by clearing session cookies.
 * Also removes the token's JTI from the database.
 */
export const logout = async () => {
  const cookieStore = cookies();
  try {
    // Remove JTI from user record
    const refreshTokenCookie = cookieStore.get(Config.refreshTokenCookieName);
    if (refreshTokenCookie) {
      const refreshToken = await verify(refreshTokenCookie.value);
      if (refreshToken.ok && refreshToken.decoded.jti) {
        const user = await Prisma.user.findUnique({
          where: {id: refreshToken.decoded.sub},
          select: {jtis: true},
        });

        if (user && user.jtis().includes(refreshToken.decoded.jti)) {
          await Prisma.user.update({
            where: {id: refreshToken.decoded.sub},
            data: {
              jtis: {
                set: user.jtis().filter((jti) => jti !== refreshToken.decoded.jti),
              },
            },
          });
        }
      }
    }
  } finally {
    // Clear cookies
    setRefreshTokenCookie(cookieStore, undefined);
  }
};

/**
 * Verifies the refresh token and issues new access and refresh tokens if valid.
 */
export const rotateTokens = async (): Promise<false | {accessToken: string; user: SessionUser}> => {
  const cookieStore = cookies();

  const refreshTokenCookie = cookieStore.get(Config.refreshTokenCookieName);
  if (!refreshTokenCookie) return false;

  const refreshToken = await verify(refreshTokenCookie.value);
  if (!refreshToken.ok || !refreshToken.decoded.jti) return false;

  const {jti: oldJTI, sub} = refreshToken.decoded;

  const user = await Prisma.user.findUnique({
    where: {id: sub},
    select: {jtis: true},
  });
  if (!user) return false;
  if (!user.jtis().includes(oldJTI)) {
    // TODO: Implement a proper invalidation strategy for refresh tokens.
    // For now, if the JTI is not found, we clear all JTIs for the user, effectively logging them out from all devices.
    await Prisma.user.update({
      where: {id: sub},
      data: {jtis: {set: []}},
    });
    return false;
  }

  const newPair = await getNewTokenPair(sub);
  if (!newPair) return false;

  try {
    await Prisma.user.update({
      where: {id: sub},
      data: {
        jtis: {
          set: [...user.jtis().filter((jti) => jti !== oldJTI), newPair.jti],
        },
      },
    });
  } catch {
    return false;
  }

  setRefreshTokenCookie(cookieStore, newPair.refreshToken);

  return {accessToken: newPair.accessToken, user: newPair.user};
};
