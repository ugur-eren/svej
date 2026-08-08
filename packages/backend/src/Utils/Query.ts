import {Prisma} from '@svej/server-side';

export const getBlocksList = async (userId: string) => {
  const blocks = await Prisma.block.findMany({
    where: {OR: [{blockerId: userId}, {blockedId: userId}]},
    select: {blockerId: true, blockedId: true},
  });

  return blocks.map((b) => (b.blockerId === userId ? b.blockedId : b.blockerId));
};

export const getBlocksListByCategory = async (userId: string) => {
  const blocks = await Prisma.block.findMany({
    where: {OR: [{blockerId: userId}, {blockedId: userId}]},
    select: {blockerId: true, blockedId: true},
  });

  const blockedUserIds: string[] = [];
  const blockedByUserIds: string[] = [];

  blocks.forEach((block) => {
    if (block.blockerId === userId) {
      blockedUserIds.push(block.blockedId);
    } else {
      blockedByUserIds.push(block.blockerId);
    }
  });

  return {
    blocked: blockedUserIds,
    blockedBy: blockedByUserIds,
  };
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

export const getBlocksWhereClause = (userId: string) => ({
  blocker: {none: {blockedId: userId}},
  blocked: {none: {blockerId: userId}},
});
