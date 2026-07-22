// eslint-disable-next-line import/no-extraneous-dependencies
import {DriverAdapterError} from '@prisma/driver-adapter-utils';
import {Prisma} from './prisma/generated/prisma/client';

export const getUniqueConstraintViolationTargets = (error: unknown): string[] | undefined => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
    return undefined;
  }

  const target = error.meta?.target;
  if (Array.isArray(target) && target.length > 0) {
    return target;
  }

  // Try to get the target from the driver adapter error if available
  const driverAdapterError = error.meta?.driverAdapterError;
  if (
    driverAdapterError instanceof DriverAdapterError &&
    driverAdapterError.cause.kind === 'UniqueConstraintViolation' &&
    driverAdapterError.cause.constraint
  ) {
    const {constraint} = driverAdapterError.cause;
    if (
      'fields' in constraint &&
      Array.isArray(constraint.fields) &&
      constraint.fields.length > 0
    ) {
      return constraint.fields;
    }
    if ('index' in constraint) {
      return [constraint.index];
    }
  }

  return undefined;
};
