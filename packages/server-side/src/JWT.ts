import {User} from 'database';
import JWT from 'jsonwebtoken';
import {JWT_EXPIRE_TIME, JWT_PRIV_KEY} from './Env';
import PrismaClient from './Prisma';

export type JwtPayload = JWT.JwtPayload;
export type VerifyErrors = JWT.VerifyErrors;

export type SignReturnType =
  | {
      ok: true;
      token: string;
    }
  | {
      ok: false;
      error: Error;
    };

export type VerifyReturnType =
  | {
      ok: true;
      user: User;
      decoded: JWT.JwtPayload;
    }
  | {
      ok: false;
      cause?: 'Unauthorized' | 'InvalidAuthToken';
      error?: JWT.VerifyErrors;
    };

export const sign = async (payload: JWT.JwtPayload): Promise<SignReturnType> => {
  return new Promise((resolve) => {
    JWT.sign(
      {
        ...payload,
        iss: payload.iss || 'svej',
        exp:
          payload.exp ||
          (JWT_EXPIRE_TIME ? Math.floor(Date.now() / 1000) + JWT_EXPIRE_TIME : undefined),
      },
      JWT_PRIV_KEY,
      {algorithm: 'HS512'},
      (err, token) => {
        if (err || !token) {
          resolve({ok: false, error: err as Error});
          return;
        }

        resolve({ok: true, token});
      },
    );
  });
};

export const verify = async (token: string): Promise<VerifyReturnType> => {
  return new Promise((resolve) => {
    JWT.verify(token, JWT_PRIV_KEY, (err, decoded) => {
      if (err) {
        resolve({ok: false, error: err || undefined});
        return;
      }

      if (typeof decoded !== 'object' || !decoded.sub) {
        resolve({ok: false, cause: 'InvalidAuthToken'});
        return;
      }

      // `Making database calls while validating JWT tokens undermines their primary advantage of being stateless.`
      // But this is a simple example backend, not going to be a production-ready one. So we can ignore this for now.
      PrismaClient.user
        .findUnique({
          where: {
            id: decoded.sub,
          },
        })
        .then((user) => {
          if (!user || !user.id || !decoded.jti || !user.jtis.includes(decoded.jti)) {
            resolve({ok: false, cause: 'Unauthorized'});
            return;
          }

          resolve({ok: true, user, decoded});
        })
        .catch(() => {
          resolve({ok: false, cause: 'Unauthorized'});
        });
    });
  });
};
