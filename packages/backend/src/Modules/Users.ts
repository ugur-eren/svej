import {ErrorCodes} from '@svej/common';
import {NotificationType, Prisma as PrismaTypes} from '@svej/database';
import {Prisma, PrismaIncludes} from '@/Services';
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

const extendUser = <T extends Author>(user: T, userId: string) => {
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
) => {
  // TODO: pagination
  const user = await Prisma.user.findUnique({
    where: {id: userId},
    select: {
      [relation]: {
        include: PrismaIncludes.Author(viewerId),
        orderBy: {
          followers: {
            _count: 'desc',
          },
        },
      },
    },
  });

  assertUserExists(user);

  return user[relation].map((rel) => extendUser(rel as Author, viewerId));
};

export const UsersModule = {
  async search(viewerId: string, query: string) {
    // TODO: pagination
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
      include: PrismaIncludes.User(viewerId),
    });

    assertUserExists(user);

    const extendedUser = extendUser(user, viewerId);

    // Send sensitive data only for the viewer's own profile
    return {...extendedUser, email: user.email()};
  },

  async updateViewer(viewerId: string, data: UpdateViewerInput) {
    if (data.username) {
      const usernameExists = await Prisma.user.findUnique({where: {username: data.username}});
      if (usernameExists && usernameExists.id !== viewerId) {
        throw new ModuleError(ErrorCodes.UsernameAlreadyExists);
      }
    }

    if (data.email) {
      const emailExists = await Prisma.user.findUnique({where: {email: data.email}});
      if (emailExists && emailExists.id !== viewerId) {
        throw new ModuleError(ErrorCodes.EmailAlreadyExists);
      }
    }

    const updatedUser = await Prisma.user.update({
      where: {id: viewerId},
      include: PrismaIncludes.User(viewerId),
      data: {
        username: data.username,
        fullname: data.fullname || null,
        email: data.email,
        bio: data.bio || null,
      },
    });

    return extendUser(updatedUser, viewerId);
  },

  async changeViewerProfilePhoto(viewerId: string, file: File) {
    return changePhoto(viewerId, 'profile', file);
  },

  async changeViewerCoverPhoto(viewerId: string, file: File) {
    return changePhoto(viewerId, 'cover', file);
  },

  async getFollowers(viewerId: string, userId: string) {
    return getFollowUsers(viewerId, userId, 'followers');
  },

  async getFollowing(viewerId: string, userId: string) {
    return getFollowUsers(viewerId, userId, 'follows');
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
};
