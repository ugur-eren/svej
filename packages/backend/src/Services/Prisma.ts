import {PrismaClient} from 'database';

const prisma = new PrismaClient();

export default prisma;

export type {PrismaTypes} from 'database';
