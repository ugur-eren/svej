import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: {
      username: 'test',
    },
    update: {},
    create: {
      username: 'test',
      email: 'test@example.com',
      fullname: 'Test User',
      password: '$2b$10$pCxKpd5xpVKuKntVmBEsg.uzywEuYtZFTCP6.yI2iO6l1fbYV9xg2', // testtest
      bio: 'This is a test user.',
      posts: {
        create: [
          {
            description: 'This is a test post.',
          },
          {
            description: 'This is the second test post.',
          },
        ],
      },
    },
  });

  await prisma.user.upsert({
    where: {
      username: 'test2',
    },
    update: {},
    create: {
      username: 'test2',
      email: 'test2@example.com',
      fullname: 'Second Test User',
      password: '$2b$10$pCxKpd5xpVKuKntVmBEsg.uzywEuYtZFTCP6.yI2iO6l1fbYV9xg2', // testtest
      bio: 'This is the second test user.',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
