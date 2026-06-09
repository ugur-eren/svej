import {io as IOClient, Socket} from 'socket.io-client';
import type {ServerToClientEvents, ClientToServerEvents} from '@svej/chat';
import {store} from '@/Redux';
import Env from '@/Utils/Env';

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export const getSocket = async (): Promise<SocketClient> => {
  const token = store.getState().auth.accessToken;

  if (!token) {
    throw new Error('Token not found');
  }

  return IOClient(Env.SVEJ_PUBLIC_CHAT_URL, {
    auth: {
      token,
    },
    ackTimeout: 20_000,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2_000,
    timeout: 10_000,
    autoConnect: true,
  });
};
