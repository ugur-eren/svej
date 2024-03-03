import {PrismaTypes} from 'database';

type PrismaError = {
  code: string;
} & (
  | {
      type: 'unknown';
    }
  | {
      type: 'duplicate';
      fields: string[];
    }
);

export const HandlePrismaError = (err: unknown): PrismaError => {
  if (!(err instanceof PrismaTypes.PrismaClientKnownRequestError)) {
    return {code: 'unknown', type: 'unknown'};
  }

  if (err.code === 'P2002') {
    return {code: err.code, type: 'duplicate', fields: (err.meta?.target || []) as string[]};
  }

  return {code: 'unknown', type: 'unknown'};
};
