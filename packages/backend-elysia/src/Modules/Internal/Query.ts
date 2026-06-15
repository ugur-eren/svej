import {Prisma as PrismaTypes} from '@svej/database';
import {ModuleError} from '@/Utils/Error';

export async function safeUpdate<T>(fn: () => Promise<T>, notFoundError: ModuleError) {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof PrismaTypes.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw notFoundError;
    }
    throw err;
  }
}
