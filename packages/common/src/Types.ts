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
