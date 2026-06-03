import {Env} from '@svej/server-side';
import {Config, ErrorCodes, Zod} from '@svej/common';
import {onlyAuthorized} from './Middlewares';
import RateLimiter from './Utils/RateLimiter';
import {WS, Prisma} from './Services';

const sendMessageRateLimiter = new RateLimiter({
  maxAttempts: Config.chatMessageRateLimitMax,
  windowMs: Config.chatMessageRateLimitWindowMs,
});

const rateLimitSweep = setInterval(
  () => sendMessageRateLimiter.sweepExpired(),
  Config.chatMessageRateLimitWindowMs,
);
rateLimitSweep.unref();

WS.use(onlyAuthorized);

WS.on('connection', (socket) => {
  const {user} = socket.data;

  // Join the user to their own room
  socket.join(`user:${user.id}`);

  socket.on('sendMessage', async (toUserId, message, callback) => {
    if (!callback || typeof callback !== 'function') return;

    if (!sendMessageRateLimiter.consume(user.id)) {
      callback({ok: false, code: ErrorCodes.ChatRateLimited});
      return;
    }

    const validation = Zod.Chat.SendMessage.safeParse({toUserId, message});
    if (!validation.success) {
      callback({ok: false, code: ErrorCodes.FillAllFields, error: validation.error});
      return;
    }

    try {
      const toUser = await Prisma.user.findUnique({
        select: {id: true},
        where: {id: validation.data.toUserId},
      });
      if (!toUser?.id) {
        callback({ok: false, code: ErrorCodes.UserNotFound});
        return;
      }

      const createdMessage = await Prisma.chatMessage.create({
        data: {
          from: {connect: {id: user.id}},
          to: {connect: {id: toUser.id}},
          message: validation.data.message,
        },
      });

      callback({ok: true, message: createdMessage});

      socket.to(`user:${toUser.id}`).emit('message', createdMessage);
    } catch (error) {
      callback({ok: false, code: ErrorCodes.UnknownError});
      console.error(error);
    }
  });
});

WS.listen(Env.CHAT_PORT);
console.info(`Chat server listening on port ${Env.CHAT_PORT}`);
