import {AckResponse, ErrorCodesKeys} from 'common';
import {User} from 'database';

export class WSError<TData = unknown> extends Error {
  public code: ErrorCodesKeys;
  public error?: Error;
  public data?: TData;

  public constructor(code: ErrorCodesKeys, error?: Error, data?: TData) {
    super(code);

    this.code = code;
    this.error = error;
    this.data = data;
  }
}

export interface ClientToServerEvents {
  sendMessage: (toUserId: string, message: string, callback: (ack: AckResponse) => void) => void;
}

export interface ServerToClientEvents {
  message: (fromUserId: string, message: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {}

export type SocketData = {
  user: User;
};
