import {MediaType, PrismaClient} from '@prisma/client';

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
      profilePhoto: {
        create: {
          type: MediaType.IMAGE,
          url: 'https://fastly.picsum.photos/id/1012/900/900.jpg?hmac=vX4Iii1FwLitTTSUgGuWnhTIxLWRJdlIosdiWKQP9mU',
          width: 600,
          height: 600,
        },
      },
      coverPhoto: {
        create: {
          type: MediaType.IMAGE,
          url: 'https://fastly.picsum.photos/id/1042/900/600.jpg?hmac=3_AK8jvV8lkPDRckeWz-_W4rhDiS20-e_1qQO_KdWLM',
          width: 900,
          height: 600,
        },
      },
      posts: {
        create: [
          {
            description: 'This is a test post.',
            medias: {
              create: [
                {
                  type: MediaType.IMAGE,
                  url: 'https://fastly.picsum.photos/id/825/600/600.jpg?hmac=jijd50jATFZEW3KSuUBCWyiEhflF_J73fpumRfI3o2w',
                  width: 600,
                  height: 600,
                },
                {
                  type: MediaType.VIDEO,
                  url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  width: 1280,
                  height: 720,
                },
                {
                  type: MediaType.IMAGE,
                  url: 'https://fastly.picsum.photos/id/74/600/600.jpg?hmac=cAuiUh13MRCGmPEUkyXGDV_Msi9bunNIjO0lCNUPTBg',
                  width: 600,
                  height: 600,
                },
              ],
            },
          },
          {
            description: 'This is the second test post.',
            medias: {
              create: {
                type: MediaType.IMAGE,
                url: 'https://fastly.picsum.photos/id/481/900/600.jpg?hmac=vMX8NCp-rb5UzuuHZHnO45XDzjPrWxinc5snC8JiEbU',
                width: 900,
                height: 600,
              },
            },
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
