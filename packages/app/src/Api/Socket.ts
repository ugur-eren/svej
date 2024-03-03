import {io as IOClient, Socket} from 'socket.io-client';
import type {ServerToClientEvents, ClientToServerEvents} from 'chat';
import Env from '../Utils/Env';
import Storage from '../Utils/Storage';

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export const getSocket = async () => {
  const token = await Storage.get('token');

  if (!token) {
    throw new Error('Token not found');
  }

  return IOClient(Env.SVEJ_PUBLIC_CHAT_URL, {
    extraHeaders: {
      authorization: token,
    },
    ackTimeout: 20_000,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2_000,
    timeout: 10_000,
    autoConnect: true,
  });
};
