import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from './prisma/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.SVEJ_DATABASE_URL,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 20_000,
});

export const prisma = new PrismaClient({
  adapter,
  omit: {
    user: {
      createdAt: true,
      updatedAt: true,
      email: true,
      password: true,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export * from './prisma/generated/prisma/client';

export type {Prisma as PrismaTypes} from './prisma/generated/prisma/client';

export * as PrismaIncludes from './includes';

export * from './helpers';
