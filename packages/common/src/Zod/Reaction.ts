import {z} from 'zod';

export const ALL_TYPES = {
  LIKE: 'LIKE',
  DISLIKE: 'DISLIKE',
  NONE: 'NONE',
} as const;
export type ALL_TYPES = (typeof ALL_TYPES)[keyof typeof ALL_TYPES];

export const TYPES = {
  [ALL_TYPES.LIKE]: ALL_TYPES.LIKE,
  [ALL_TYPES.DISLIKE]: ALL_TYPES.DISLIKE,
} as const;
export type TYPES = (typeof TYPES)[keyof typeof TYPES];

export const type = z.enum(TYPES);
