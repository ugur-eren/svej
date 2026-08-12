import {Config} from '@svej/common';
import {Prisma, PrismaIncludes} from '@svej/server-side';
import {assertNotificationExists} from './Internal/Assert';
import {extendNotification} from './Internal/Query';

export const NotificationsModule = {
  async getById(viewerId: string, notificationId: string) {
    const notification = await Prisma.notification.findUnique({
      where: {id: notificationId},
      include: PrismaIncludes.Notification(viewerId),
    });

    assertNotificationExists(notification);

    return extendNotification(notification);
  },

  async getAll(viewerId: string, cursor?: string) {
    const notifications = await Prisma.notification.findMany({
      skip: cursor ? 1 : 0,
      take: Config.notificationsPerPage,
      cursor: cursor ? {id: cursor} : undefined,
      include: PrismaIncludes.Notification(viewerId),
      where: {ownerId: viewerId},
      orderBy: [{createdAt: 'desc'}, {id: 'desc'}],
    });

    const lastNotification = notifications[notifications.length - 1];
    const nextCursor = lastNotification ? lastNotification.id : undefined;

    return {
      notifications: notifications.map((notification) => extendNotification(notification)),
      nextCursor,
    };
  },

  async getUnreadCount(viewerId: string) {
    const count = await Prisma.notification.count({where: {ownerId: viewerId}});

    return count;
  },
};
