import {Server} from 'socket.io';
import {ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData} from '../types';

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>({
  // options
  cors: {
    origin: '*',
  },
});

export default io;
