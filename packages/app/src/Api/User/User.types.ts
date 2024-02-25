import type {PrismaTypes, PrismaIncludes, User as PrismaUser} from 'database';

export type ExtendedType = {
  isFollowing: boolean;
};

export type User = PrismaTypes.UserGetPayload<{include: ReturnType<typeof PrismaIncludes.User>}> &
  ExtendedType;

export type RegisterRequest = {
  username: string;
  password: string;
  fullName: string;
  email: string;
};

export type RegisterResponse = PrismaUser;

export type Author = PrismaTypes.UserGetPayload<{
  include: ReturnType<typeof PrismaIncludes.Author>;
}> &
  ExtendedType;

export type SearchResponse = Array<Author>;
