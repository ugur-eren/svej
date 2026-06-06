import type {PrismaTypes, PrismaIncludes} from '@svej/database';
import {Zod} from '@svej/common';

export type ExtendedType = {
  isFollowing: boolean;
};

export type User = PrismaTypes.UserGetPayload<{include: ReturnType<typeof PrismaIncludes.User>}> &
  ExtendedType;

export type EditRequest = (typeof Zod.User.Edit)['_output'];

export type Author = PrismaTypes.UserGetPayload<{
  include: ReturnType<typeof PrismaIncludes.Author>;
}> &
  ExtendedType;

export type SearchResponse = Array<Author>;

export type Relations = Array<Author>;
