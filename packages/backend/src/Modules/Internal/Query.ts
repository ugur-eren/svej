import {Prisma as PrismaTypes} from '@svej/database';
import {ModuleError} from '@/Utils/Error';

export async function safeUpdate<T>(fn: () => Promise<T>, notFoundError: ModuleError) {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof PrismaTypes.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw notFoundError;
    }
    throw err;
  }
}

type Author = {followers: {id: string}[]};
export const extendAuthor = <T extends Author>(author: T) => {
  const {followers, ...rest} = author;

  return {
    ...rest,
    isFollowing: followers.length > 0,
  };
};

type Post = {likes: {id: string}[]; dislikes: {id: string}[]; author: Author};
export const extendPost = <T extends Post>(post: T) => {
  const {likes, dislikes, author, ...rest} = post;

  return {
    ...rest,
    author: extendAuthor<T['author']>(author),
    liked: likes.length > 0,
    disliked: dislikes.length > 0,
  };
};

type Comment = {likes: {id: string}[]; dislikes: {id: string}[]; author: Author};
export const extendComment = <T extends Comment>(comment: T) => {
  const {likes, dislikes, author, ...rest} = comment;

  return {
    ...rest,
    author: extendAuthor<T['author']>(author),
    liked: likes.length > 0,
    disliked: dislikes.length > 0,
  };
};

type Notification = {user: Author; post?: Post | null; comment?: Comment | null};
export const extendNotification = <T extends Notification>(notification: T) => {
  const {user, post, comment, ...rest} = notification;

  return {
    ...rest,
    user: extendAuthor<T['user']>(user),
    post: post ? extendPost<NonNullable<T['post']>>(post) : null,
    comment: comment ? extendComment<NonNullable<T['comment']>>(comment) : null,
  };
};

type Conversation = {
  user1: Author;
  user1Id: string;
  user2: Author;
  user2Id: string;
  messages: {id: string}[];
};
export const extendConversation = <T extends Conversation>(conversation: T, viewerId: string) => {
  const {user1, user2, messages, ...rest} = conversation;

  return {
    ...rest,

    participant:
      conversation.user1Id === viewerId
        ? extendAuthor<T['user2']>(user2)
        : extendAuthor<T['user1']>(user1),

    lastMessage: (messages.length ? messages[0] : null) as T['messages'][number] | null,
  };
};
