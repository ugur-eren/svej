import type {Prisma} from './prisma/generated/prisma/client';

export const Author = (userId: string) =>
  ({
    profilePhoto: true,
    tags: true,
    followers: {select: {id: true}, where: {id: userId}},
  }) satisfies Prisma.UserInclude;

export const User = (userId: string) =>
  ({
    _count: {
      select: {
        posts: {
          where: {
            active: true,
          },
        },
        follows: true,
        followers: true,
      },
    },

    profilePhoto: true,
    coverPhoto: true,
    tags: true,
    followers: {select: {id: true}, where: {id: userId}},
  }) satisfies Prisma.UserInclude;

export const Post = (userId: string) =>
  ({
    _count: {
      select: {
        comments: {
          where: {
            active: true,
          },
        },
        likes: true,
        dislikes: true,
      },
    },

    medias: true,
    author: {include: Author(userId)},

    likes: {
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    },
    dislikes: {
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    },

    comments: {
      where: {
        active: true,
      },
      include: {
        author: {include: Author(userId)},
      },
      take: 2,
      orderBy: {
        likes: {
          _count: 'desc',
        },
      },
    },
  }) satisfies Prisma.PostInclude;

export const Comment = (userId: string) =>
  ({
    _count: {
      select: {
        likes: true,
        dislikes: true,
      },
    },

    likes: {
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    },
    dislikes: {
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    },

    author: {include: Author(userId)},
  }) satisfies Prisma.CommentInclude;

export const Notification = (userId: string) =>
  ({
    user: {
      include: Author(userId),
    },
    post: {
      where: {
        active: true,
      },
      include: Post(userId),
    },
    comment: {
      where: {
        active: true,
      },
      include: Comment(userId),
    },
    warning: true,
  }) satisfies Prisma.NotificationInclude;

export const ChatMessage = (userId: string) =>
  ({
    from: {include: Author(userId)},
  }) satisfies Prisma.ChatMessageInclude;

export const Conversation = (userId: string) =>
  ({
    user1: {
      include: Author(userId),
    },
    user2: {
      include: Author(userId),
    },
    messages: {
      take: 1,
      include: {
        from: {
          include: Author(userId),
        },
      },
      orderBy: {createdAt: 'desc'},
    },
  }) satisfies Prisma.ConversationInclude;
