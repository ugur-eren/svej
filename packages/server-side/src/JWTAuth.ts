import crypto from 'node:crypto';
import {Config, SessionUser} from '@svej/common';
import type {Cookie, CookieOptions} from 'elysia';
import {sign, verify} from './JWT';
import {Prisma} from './Prisma';

const refreshTokenCookieConfig: Partial<CookieOptions> = {
  path: '/auth',
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
};

const setRefreshTokenCookie = (cookies: Record<string, Cookie<unknown>>, refreshToken: string) => {
  cookies[Config.refreshTokenCookieName].set({
    ...refreshTokenCookieConfig,
    maxAge: Config.jwtRefreshTokenTTL,
    expires: new Date(Date.now() + Config.jwtRefreshTokenTTL * 1_000),
    value: refreshToken,
  });
};

const clearRefreshTokenCookie = (cookies: Record<string, Cookie<unknown>>) => {
  cookies[Config.refreshTokenCookieName].set({
    ...refreshTokenCookieConfig,
    maxAge: 0,
    expires: new Date(0),
    value: '',
  });
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
    user: {
      ...user,
      email: user.email,
    },
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
  cookies: Record<string, Cookie<unknown>>,
  userId: string,
): Promise<false | {accessToken: string; user: SessionUser}> => {
  const newPair = await getNewTokenPair(userId);
  if (!newPair) return false;

  const {accessToken, refreshToken, user, jti} = newPair;

  try {
    await Prisma.session.create({
      data: {
        currentJTI: jti,
        absoluteExpiresAt: new Date(Date.now() + Config.sessionAbsoluteTTL * 1_000),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  } catch {
    return false;
  }

  setRefreshTokenCookie(cookies, refreshToken);

  return {accessToken, user};
};

/**
 * Logs out the current user by clearing session cookies.
 * Also removes the token's JTI from the database.
 */
export const logout = async (cookies: Record<string, Cookie<unknown>>) => {
  try {
    // Remove JTI from user record
    const refreshTokenCookie = cookies[Config.refreshTokenCookieName];
    if (!refreshTokenCookie || typeof refreshTokenCookie.value !== 'string') return;

    const refreshToken = await verify(refreshTokenCookie.value);
    if (!refreshToken.ok || !refreshToken.decoded.jti) return;

    const session = await Prisma.session.findUnique({
      where: {currentJTI: refreshToken.decoded.jti},
      select: {id: true},
    });

    if (session?.id) {
      await Prisma.session.delete({
        where: {
          id: session.id,
        },
      });
    }
  } finally {
    // Clear cookies
    clearRefreshTokenCookie(cookies);
  }
};

/**
 * Verifies the refresh token and issues new access and refresh tokens if valid.
 */
export const rotateTokens = async (
  cookies: Record<string, Cookie<unknown>>,
): Promise<false | {accessToken: string; user: SessionUser}> => {
  const refreshTokenCookie = cookies[Config.refreshTokenCookieName];
  if (!refreshTokenCookie || typeof refreshTokenCookie.value !== 'string') return false;

  const refreshToken = await verify(refreshTokenCookie.value);
  if (!refreshToken.ok || !refreshToken.decoded.jti) return false;

  const {jti: oldJTI, sub} = refreshToken.decoded;

  const existingSession = await Prisma.session.findFirst({
    where: {
      OR: [{currentJTI: oldJTI}, {previousJTI: oldJTI}],
    },
    select: {
      id: true,
      currentJTI: true,
      previousJTI: true,
      rotatedAt: true,
      absoluteExpiresAt: true,
    },
  });

  if (!existingSession) {
    // Session not found, possible invalid or expired session.
    clearRefreshTokenCookie(cookies);
    return false;
  }

  if (existingSession.absoluteExpiresAt < new Date()) {
    // Session absolute expiration reached, force logout
    try {
      await Prisma.session.delete({where: {id: existingSession.id}});
    } finally {
      clearRefreshTokenCookie(cookies);
    }
    return false;
  }

  if (existingSession.previousJTI === oldJTI) {
    // Token reuse detected, check if it's within grace period
    const now = new Date();
    const isWithinGracePeriod = existingSession.rotatedAt
      ? now.getTime() - existingSession.rotatedAt.getTime() <= Config.sessionGracePeriod * 1_000
      : false;

    if (!isWithinGracePeriod) {
      // Outside of grace period, possible token theft, revoke session
      try {
        await Prisma.session.delete({where: {id: existingSession.id}});
      } finally {
        clearRefreshTokenCookie(cookies);
      }

      return false;
    }
  }

  // Current token is valid, proceed with rotation.
  // This covers both normal rotation and reuse within grace period.
  // Issue new tokens and update session with new JTI.

  const newPair = await getNewTokenPair(sub);
  if (!newPair) return false;

  try {
    await Prisma.session.update({
      where: {
        id: existingSession.id,
        currentJTI: existingSession.currentJTI,
      },
      data: {
        currentJTI: newPair.jti,
        previousJTI: existingSession.currentJTI,
        rotatedAt: new Date(),
      },
    });
  } catch {
    return false;
  }

  setRefreshTokenCookie(cookies, newPair.refreshToken);

  return {accessToken: newPair.accessToken, user: newPair.user};
};
