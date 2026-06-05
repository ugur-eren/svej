import type {User, Media} from '@svej/database';
import type {JwtPayload} from 'jsonwebtoken';
import type {ErrorCodesKeys} from './ErrorCodes';

export type AckError = {
  ok: false;
  code: ErrorCodesKeys;
  error?: Error;
};

export type AckSuccess<T = unknown> = {
  ok: true;
} & T;

export type AckResponse<T = unknown> = AckSuccess<T> | AckError;

export type SessionUser = Pick<User, 'id' | 'active' | 'username' | 'fullname' | 'email'> & {
  profilePhoto?: Pick<Media, 'id' | 'fileKey'> | null;
  coverPhoto?: Pick<Media, 'id' | 'fileKey'> | null;
};

export type Session = JwtPayload & {sub: string; user: SessionUser};
