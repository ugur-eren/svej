import {Prisma} from '@svej/server-side';

export const getBlocksList = async (userId: string) => {
  const blocks = await Prisma.block.findMany({
    where: {OR: [{blockerId: userId}, {blockedId: userId}]},
    select: {blockerId: true, blockedId: true},
  });

  return blocks.map((b) => (b.blockerId === userId ? b.blockedId : b.blockerId));
};

export const isBlocked = async (userAId: string, userBId: string) => {
  if (userAId === userBId) return false;

  const block = await Prisma.block.findFirst({
    where: {
      OR: [
        {blockerId: userAId, blockedId: userBId},
        {blockerId: userBId, blockedId: userAId},
      ],
    },
    select: {
      id: true,
    },
  });

  return !!block;
};

export const getBlockStatus = async (userAId: string, userBId: string) => {
  if (userAId === userBId) {
    return {
      blocked: false,
      blockedBy: false,
    };
  }

  const blocks = await Prisma.block.findMany({
    where: {
      OR: [
        {blockerId: userAId, blockedId: userBId},
        {blockerId: userBId, blockedId: userAId},
      ],
    },
    select: {
      blockerId: true,
      blockedId: true,
    },
  });

  return {
    blocked: blocks.some((b) => b.blockerId === userAId && b.blockedId === userBId),
    blockedBy: blocks.some((b) => b.blockerId === userBId && b.blockedId === userAId),
  };
};

export const getBlocksWhereClause = (userId: string) => ({
  blocker: {none: {blockedId: userId}},
  blocked: {none: {blockerId: userId}},
});
