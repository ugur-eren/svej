import {PrismaClient} from 'database';

export * as PrismaIncludes from '../Utils/PrismaIncludes';

const prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error']});

export default prisma;

export type {PrismaTypes} from 'database';
