import {Config, ErrorCodes} from '@svej/common';
import {
  getUniqueConstraintViolationTargets,
  NotificationType,
  Prisma as PrismaTypes,
} from '@svej/database';
import {Prisma, PrismaIncludes} from '@svej/server-side';
import {ModuleError} from '@/Utils/Error';
import {ImageHandler} from '@/Utils/ImageHandler';
import {getBlocksList, getBlocksListByCategory, isBlocked} from '@/Utils/Query';
import {assertUserExists} from './Internal/Assert';

export type UpdateViewerInput = {
  username?: string;
  fullname?: string;
  email?: string;
  bio?: string;
};

type Author = PrismaTypes.UserGetPayload<{include: ReturnType<typeof PrismaIncludes.Author>}>;

const extendUser = <T extends {followers: {id: string}[]}>(user: T) => {
  const {followers, ...rest} = user;

  return {
    ...rest,
    isFollowing: followers.length > 0,
  };
};

const changePhoto = async (viewerId: string, type: 'profile' | 'cover', file: File) => {
  const media = await ImageHandler(file, type);

  await Prisma.user.update({
    where: {id: viewerId},
    data: {
      [type === 'profile' ? 'profilePhoto' : 'coverPhoto']: {
        create: media,
      },
    },
  });
};

const getFollowUsers = async (
  viewerId: string,
  userId: string,
  relation: 'followers' | 'follows',
  cursor?: string,
) => {
  const excludedUserIds = await getBlocksList(viewerId);

  if (viewerId !== userId && excludedUserIds.includes(userId)) {
    assertUserExists(null);
  }

  const user = await Prisma.user.findUnique({
    where: {id: userId},
    select: {
      [relation]: {
        where: {id: {notIn: excludedUserIds}},
        skip: cursor ? 1 : 0,
        take: Config.relationsPerPage,
        cursor: cursor ? {id: cursor} : undefined,
        include: PrismaIncludes.Author(viewerId),
        orderBy: [{followers: {_count: 'desc'}}, {id: 'desc'}],
      },
    },
  });

  assertUserExists(user);

  const lastRelation = user[relation][user[relation].length - 1];
  const nextCursor = lastRelation ? lastRelation.id : undefined;

  return {
    users: user[relation].map((rel) => extendUser(rel as Author)),
    nextCursor,
  };
};

export const UsersModule = {
  async search(viewerId: string, query: string) {
    const excludedUserIds = await getBlocksList(viewerId);

    // TODO: Proper search implementation
    const users = await Prisma.user.findMany({
      where: {
        AND: [
          {id: {notIn: [...excludedUserIds, viewerId]}},
          {
            OR: [
              {username: {contains: query, mode: 'insensitive'}},
              {fullname: {contains: query, mode: 'insensitive'}},
              {bio: {contains: query, mode: 'insensitive'}},
            ],
          },
        ],
      },
      orderBy: {followers: {_count: 'desc'}},
      take: 20,
      include: PrismaIncludes.Author(viewerId),
    });

    return users.map((user) => extendUser(user));
  },

  async getById(viewerId: string, userId: string) {
    const user = await Prisma.user.findUnique({
      where: {id: userId},
      include: PrismaIncludes.User(viewerId),
    });

    assertUserExists(user);

    const blocksList = await getBlocksListByCategory(viewerId);

    if (blocksList.blockedBy.includes(user.id)) {
      assertUserExists(null);
    }

    return {
      ...extendUser(user),
      isBlocked: blocksList.blocked.includes(user.id) ? true : undefined,
    };
  },

  async getByUsername(viewerId: string, username: string) {
    const user = await Prisma.user.findUnique({
      where: {username},
      include: PrismaIncludes.User(viewerId),
    });

    assertUserExists(user);

    const blocksList = await getBlocksListByCategory(viewerId);

    if (blocksList.blockedBy.includes(user.id)) {
      assertUserExists(null);
    }

    return {
      ...extendUser(user),
      isBlocked: blocksList.blocked.includes(user.id) ? true : undefined,
    };
  },

  async getViewer(viewerId: string) {
    const user = await Prisma.user.findUnique({
      where: {id: viewerId},
      omit: {
        email: false,
      },
      include: PrismaIncludes.User(viewerId),
    });

    assertUserExists(user);

    const extendedUser = extendUser(user);

    return extendedUser;
  },

  async updateViewer(viewerId: string, data: UpdateViewerInput) {
    try {
      const updatedUser = await Prisma.user.update({
        where: {id: viewerId},
        omit: {
          email: false,
        },
        include: PrismaIncludes.User(viewerId),
        data: {
          username: data.username,
          fullname: data.fullname || null,
          email: data.email,
          bio: data.bio || null,
        },
      });

      return extendUser(updatedUser);
    } catch (error) {
      const target = getUniqueConstraintViolationTargets(error);
      if (!target) throw error;

      if (target.includes(PrismaTypes.UserScalarFieldEnum.username)) {
        throw new ModuleError(ErrorCodes.UsernameAlreadyExists);
      }

      if (target.includes(PrismaTypes.UserScalarFieldEnum.email)) {
        throw new ModuleError(ErrorCodes.EmailAlreadyExists);
      }

      throw error;
    }
  },

  async changeViewerProfilePhoto(viewerId: string, file: File) {
    return changePhoto(viewerId, 'profile', file);
  },

  async changeViewerCoverPhoto(viewerId: string, file: File) {
    return changePhoto(viewerId, 'cover', file);
  },

  async getFollowers(viewerId: string, userId: string, cursor?: string) {
    return getFollowUsers(viewerId, userId, 'followers', cursor);
  },

  async getFollowing(viewerId: string, userId: string, cursor?: string) {
    return getFollowUsers(viewerId, userId, 'follows', cursor);
  },

  async follow(viewerId: string, userId: string) {
    if (viewerId === userId) {
      throw new ModuleError(ErrorCodes.CannotFollowYourself);
    }

    const user = await Prisma.user.findUnique({
      where: {id: userId},
      include: {followers: {where: {id: viewerId}}},
    });

    assertUserExists(user);

    if (await isBlocked(viewerId, userId)) {
      assertUserExists(null);
    }

    if (user.followers.length > 0) {
      throw new ModuleError(ErrorCodes.AlreadyFollowing);
    }

    await Prisma.user.update({
      where: {id: viewerId},
      data: {
        follows: {connect: {id: userId}},
        relatedNotifications: {
          create: {
            type: NotificationType.FOLLOW,
            owner: {connect: {id: userId}},
          },
          deleteMany: {
            type: NotificationType.UNFOLLOW,
            ownerId: userId,
          },
        },
      },
    });
  },

  async unfollow(viewerId: string, userId: string) {
    if (viewerId === userId) {
      throw new ModuleError(ErrorCodes.CannotFollowYourself);
    }

    const user = await Prisma.user.findUnique({
      where: {id: userId},
      include: {followers: {where: {id: viewerId}}},
    });

    assertUserExists(user);

    if (user.followers.length === 0) {
      throw new ModuleError(ErrorCodes.NotFollowing);
    }

    await Prisma.user.update({
      where: {id: viewerId},
      data: {
        follows: {disconnect: {id: userId}},
        relatedNotifications: {
          create: {
            type: NotificationType.UNFOLLOW,
            owner: {connect: {id: userId}},
          },
          deleteMany: {
            type: NotificationType.FOLLOW,
            ownerId: userId,
          },
        },
      },
    });
  },

  async getBlockedUsers(viewerId: string, cursor?: string) {
    const blockedUsers = await Prisma.block.findMany({
      where: {blockerId: viewerId},
      skip: cursor ? 1 : 0,
      take: Config.relationsPerPage,
      cursor: cursor ? {id: cursor} : undefined,
      orderBy: [{createdAt: 'desc'}, {id: 'desc'}],
      omit: {
        blockerId: true,
      },
      include: {
        blocked: {
          include: PrismaIncludes.Author(viewerId),
        },
      },
    });

    const lastBlocked = blockedUsers[blockedUsers.length - 1];
    const nextCursor = lastBlocked ? lastBlocked.id : undefined;

    return {
      users: blockedUsers.map((blocked) => ({
        ...blocked,
        blocked: extendUser(blocked.blocked as Author),
      })),
      nextCursor,
    };
  },

  async block(viewerId: string, userId: string) {
    if (viewerId === userId) {
      throw new ModuleError(ErrorCodes.CannotBlockYourself);
    }

    const user = await Prisma.user.findUnique({
      where: {id: userId},
      select: {id: true},
    });

    assertUserExists(user);

    const blockedUser = await Prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: viewerId,
          blockedId: userId,
        },
      },
    });

    if (blockedUser?.id) {
      throw new ModuleError(ErrorCodes.AlreadyBlocked);
    }

    await Prisma.$transaction([
      Prisma.block.create({
        data: {
          blockerId: viewerId,
          blockedId: userId,
        },
      }),

      Prisma.user.update({
        where: {
          id: viewerId,
        },
        data: {
          followers: {
            disconnect: {
              id: userId,
            },
          },
          follows: {
            disconnect: {
              id: userId,
            },
          },
        },
      }),

      Prisma.notification.deleteMany({
        where: {
          OR: [
            {ownerId: viewerId, userId},
            {ownerId: userId, userId: viewerId},
          ],
        },
      }),
    ]);
  },

  async unblock(viewerId: string, userId: string) {
    if (viewerId === userId) {
      throw new ModuleError(ErrorCodes.CannotBlockYourself);
    }

    const blockedUser = await Prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: viewerId,
          blockedId: userId,
        },
      },
    });

    if (!blockedUser?.id) {
      throw new ModuleError(ErrorCodes.NotBlocked);
    }

    await Prisma.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId: viewerId,
          blockedId: userId,
        },
      },
    });
  },

  async create(data: {username: string; email: string; password: string; fullname?: string}) {
    try {
      const user = await Prisma.user.create({
        omit: {
          email: false,
        },
        data: {
          username: data.username,
          email: data.email,
          fullname: data.fullname,
          password: data.password,
        },
      });

      return user;
    } catch (error) {
      const target = getUniqueConstraintViolationTargets(error);
      if (!target) throw error;

      if (target.includes(PrismaTypes.UserScalarFieldEnum.email)) {
        throw new ModuleError(ErrorCodes.EmailAlreadyExists);
      }

      if (target.includes(PrismaTypes.UserScalarFieldEnum.username)) {
        throw new ModuleError(ErrorCodes.UsernameAlreadyExists);
      }

      throw error;
    }
  },
};
