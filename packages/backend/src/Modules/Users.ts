import {Config, ErrorCodes} from '@svej/common';
import {
  getUniqueConstraintViolationTargets,
  NotificationType,
  Prisma as PrismaTypes,
} from '@svej/database';
import {Prisma, PrismaIncludes} from '@svej/server-side';
import {ModuleError} from '@/Utils/Error';
import {ImageHandler} from '@/Utils/ImageHandler';
import {assertUserExists} from './Internal/Assert';

export type UpdateViewerInput = {
  username?: string;
  fullname?: string;
  email?: string;
  bio?: string;
};

type Author = PrismaTypes.UserGetPayload<{include: ReturnType<typeof PrismaIncludes.Author>}>;

const extendUser = <T extends {followers: {id: string}[]}>(user: T, userId: string) => {
  return {
    ...user,
    isFollowing: user.followers.some((follower) => follower.id === userId),
  };
};

const changePhoto = async (viewerId: string, type: 'profile' | 'cover', file: File) => {
  const media = await ImageHandler(file, type);

  await Prisma.user.update({
    where: {id: viewerId},
    data: {
      [type === 'profile' ? 'profilePhoto' : 'coverPhoto']: {
        create: media,
        delete: true,
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
  const user = await Prisma.user.findUnique({
    where: {id: userId},
    select: {
      [relation]: {
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
    users: user[relation].map((rel) => extendUser(rel as Author, viewerId)),
    nextCursor,
  };
};

export const UsersModule = {
  async search(viewerId: string, query: string) {
    const users = await Prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [{username: {contains: query}}, {fullname: {contains: query}}],
          },
          {
            id: {
              not: viewerId,
            },
          },
        ],
      },
      orderBy: {followers: {_count: 'desc'}},
      take: 20,
      include: PrismaIncludes.Author(viewerId),
    });

    return users.map((user) => extendUser(user, viewerId));
  },

  async getById(viewerId: string, userId: string) {
    const user = await Prisma.user.findUnique({
      where: {id: userId},
      include: PrismaIncludes.User(viewerId),
    });

    assertUserExists(user);

    return extendUser(user, viewerId);
  },

  async getByUsername(viewerId: string, username: string) {
    const user = await Prisma.user.findUnique({
      where: {username},
      include: PrismaIncludes.User(viewerId),
    });

    assertUserExists(user);

    return extendUser(user, viewerId);
  },

  async getViewer(viewerId: string) {
    const user = await Prisma.user.findUnique({
      where: {id: viewerId},
      omit: {
        email: false,
      },
      include: {
        ...PrismaIncludes.User(viewerId),

        // Send sensitive data only for the viewer's own profile
        email: true,
      },
    });

    assertUserExists(user);

    const extendedUser = extendUser(user, viewerId);

    return extendedUser;
  },

  async updateViewer(viewerId: string, data: UpdateViewerInput) {
    try {
      const updatedUser = await Prisma.user.update({
        where: {id: viewerId},
        include: {
          ...PrismaIncludes.User(viewerId),

          // Send sensitive data only for the viewer's own profile
          email: true,
        },
        data: {
          username: data.username,
          fullname: data.fullname || null,
          email: data.email,
          bio: data.bio || null,
        },
      });

      return extendUser(updatedUser, viewerId);
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

  async create(data: {username: string; email: string; password: string; fullname?: string}) {
    try {
      const user = await Prisma.user.create({
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
