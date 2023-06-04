import {PrismaClient} from 'database';

const prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error']});

export default prisma;

export type {PrismaTypes} from 'database';
