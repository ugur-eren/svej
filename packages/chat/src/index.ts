import {Env, Prisma} from '@svej/server-side';
import {Config, ErrorCodes, Zod} from '@svej/common';
import {Prisma as PrismaTypes} from '@svej/database';
import {onlyAuthorized} from './Middlewares';
import RateLimiter from './Utils/RateLimiter';
import {WS} from './Services';

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
    if (typeof callback !== 'function') return;

    if (!sendMessageRateLimiter.consume(user.id)) {
      callback({ok: false, code: ErrorCodes.ChatRateLimited});
      return;
    }

    const validation = Zod.Chat.SendMessage.safeParse({toUserId, message});
    if (!validation.success) {
      callback({ok: false, code: ErrorCodes.FillAllFields, error: validation.error});
      return;
    }

    let createdMessage;
    try {
      createdMessage = await Prisma.chatMessage.create({
        data: {
          from: {connect: {id: user.id}},
          to: {connect: {id: validation.data.toUserId}},
          message: validation.data.message,
        },
      });
    } catch (error) {
      if (error instanceof PrismaTypes.PrismaClientKnownRequestError && error.code === 'P2003') {
        callback({ok: false, code: ErrorCodes.UserNotFound});
        return;
      }

      callback({ok: false, code: ErrorCodes.UnknownError});
      console.error(error);
      return;
    }

    socket.to(`user:${validation.data.toUserId}`).emit('message', createdMessage);

    callback({ok: true, message: createdMessage});
  });
});

WS.listen(Env.CHAT_PORT);
console.info(`Chat server listening on port ${Env.CHAT_PORT}`);
