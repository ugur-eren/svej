import {Env} from 'server-side';
import {ErrorCodes} from 'common';
import {onlyAuthorized} from './Middlewares';
import {WS, Prisma} from './Services';

WS.use(onlyAuthorized);

WS.on('connection', (socket) => {
  const {user} = socket.data;

  // Join the user to their own room
  socket.join(`user:${user.id}`);

  socket.on('sendMessage', async (toUserId, message, callback) => {
    if (!callback || typeof callback !== 'function') return;

    const toUser = await Prisma.user.findUnique({select: {id: true}, where: {id: toUserId}});
    if (!toUser?.id) {
      callback({ok: false, code: ErrorCodes.UserNotFound});
      return;
    }

    const createdMessage = await Prisma.chatMessage.create({
      data: {
        from: {connect: {id: user.id}},
        to: {connect: {id: toUser.id}},
        message,
      },
    });

    callback({ok: true, message: createdMessage});

    socket.to(`user:${toUser.id}`).emit('message', createdMessage);
  });

  socket.on('disconnect', () => {
    //
  });
});

WS.listen(Env.CHAT_PORT);

(async () => {
  console.info(`Chat server listening on port ${Env.CHAT_PORT}`);
})();
