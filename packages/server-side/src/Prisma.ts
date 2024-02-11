import {PrismaClient} from 'database';

const prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error']});

const extended = prisma.$extends({
  name: 'views',
  model: {},
});

export default extended;
