import {Env, Prisma} from '@svej/server-side';
import {Config, ErrorCodes, Zod} from '@svej/common';
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

  socket.on('sendMessage', async (conversationId, message, callback) => {
    if (typeof callback !== 'function') return;

    if (!sendMessageRateLimiter.consume(user.id)) {
      callback({ok: false, code: ErrorCodes.ChatRateLimited});
      return;
    }

    const validation = Zod.Chat.SendMessage.safeParse({conversationId, message});
    if (!validation.success) {
      callback({ok: false, code: ErrorCodes.FillAllFields, error: validation.error});
      return;
    }

    const conversation = await Prisma.conversation.findUnique({
      where: {
        id: validation.data.conversationId,
        user1: {
          blocker: {none: {blockedId: user.id}},
          blocked: {none: {blockerId: user.id}},
        },
        user2: {
          blocker: {none: {blockedId: user.id}},
          blocked: {none: {blockerId: user.id}},
        },
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    if (!conversation) {
      callback({ok: false, code: ErrorCodes.ConversationNotFound});
      return;
    }

    let createdMessage;
    try {
      createdMessage = await Prisma.chatMessage.create({
        data: {
          conversationId: validation.data.conversationId,
          fromId: user.id,
          message: validation.data.message,
        },
      });
    } catch (error) {
      callback({ok: false, code: ErrorCodes.UnknownError});
      console.error(error);
      return;
    }

    const toUserId = conversation.user1Id === user.id ? conversation.user2Id : conversation.user1Id;

    socket.to(`user:${toUserId}`).emit('message', createdMessage);

    callback({ok: true, message: createdMessage});
  });
});

WS.listen(Env.CHAT_PORT);
console.info(`Chat server listening on port ${Env.CHAT_PORT}`);
