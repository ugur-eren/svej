import type {PrismaTypes, PrismaIncludes, User as PrismaUser} from 'database';

export type {PrismaUser};

export type User = PrismaTypes.UserGetPayload<{include: typeof PrismaIncludes.User}>;

export type RegisterRequest = {
  username: string;
  password: string;
  fullName: string;
  email: string;
};

export type RegisterResponse = PrismaUser;
