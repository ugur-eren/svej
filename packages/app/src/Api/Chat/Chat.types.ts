import {PrismaIncludes, PrismaTypes, ChatMessage} from 'database';

export type ChatUser = PrismaTypes.UserGetPayload<{
  include: ReturnType<typeof PrismaIncludes.Author>;
}> & {
  lastMessage?: ChatMessage;
};

export type {ChatMessage};
