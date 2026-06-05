import {Config} from '@svej/common';
import JWT, {JsonWebTokenError} from 'jsonwebtoken';
import {JWT_SECRET} from './Env';

export type JwtPayload = JWT.JwtPayload;
export type VerifyErrors = JWT.VerifyErrors;

export type SignReturnType =
  | {
      ok: true;
      token: string;
    }
  | {
      ok: false;
      error?: Error;
    };

export type VerifyReturnType<TExtraClaims = unknown> =
  | {
      ok: true;
      decoded: JWT.JwtPayload & {sub: string} & TExtraClaims;
    }
  | {
      ok: false;
      error?: JWT.VerifyErrors;
    };

export const sign = async (payload: JWT.JwtPayload): Promise<SignReturnType> => {
  return new Promise((resolve) => {
    JWT.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        iss: payload.iss ?? Config.jwtIssuer,
        exp: payload.exp ?? Math.floor(Date.now() / 1000) + Config.jwtDefaultTTL,
      },
      JWT_SECRET,
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

export const verify = async <TExtraClaims = unknown>(
  token: string,
): Promise<VerifyReturnType<TExtraClaims>> => {
  return new Promise((resolve) => {
    JWT.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        resolve({ok: false, error: err ?? undefined});
        return;
      }

      if (typeof decoded !== 'object' || !decoded.sub) {
        resolve({
          ok: false,
          error: new JsonWebTokenError('InvalidAuthToken'),
        });
        return;
      }

      resolve({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        decoded: decoded as any,
      });
    });
  });
};
