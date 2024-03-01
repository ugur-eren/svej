import type {PrismaTypes, PrismaIncludes, User as PrismaUser} from 'database';
import {Zod} from 'common';

export type ExtendedType = {
  isFollowing: boolean;
};

export type User = PrismaTypes.UserGetPayload<{include: ReturnType<typeof PrismaIncludes.User>}> &
  ExtendedType;

export type ChangePasswordRequest = (typeof Zod.User.ChangePassword)['_output'];

export type EditRequest = (typeof Zod.User.Edit)['_output'];

export type RegisterRequest = (typeof Zod.User.Create)['_output'];

export type RegisterResponse = PrismaUser;

export type Author = PrismaTypes.UserGetPayload<{
  include: ReturnType<typeof PrismaIncludes.Author>;
}> &
  ExtendedType;

export type SearchResponse = Array<Author>;

export type Relations = Array<Author>;
