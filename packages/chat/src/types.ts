import {AckResponse, ErrorCodesKeys} from 'common';
import {ChatMessage, User} from 'database';

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
  sendMessage: (
    toUserId: string,
    message: string,
    callback: (ack: AckResponse<{message: ChatMessage}>) => void,
  ) => void;
}

export interface ServerToClientEvents {
  message: (message: ChatMessage) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {}

export type SocketData = {
  user: User;
};
