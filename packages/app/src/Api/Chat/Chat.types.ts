import {PrismaIncludes, PrismaTypes, ChatMessage} from '@svej/database';

export type ChatUser = PrismaTypes.UserGetPayload<{
  include: ReturnType<typeof PrismaIncludes.Author>;
}> & {
  lastMessage?: ChatMessage;
};

export type {ChatMessage};
