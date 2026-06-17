import {Prisma, PrismaIncludes} from '@/Services';
import {assertNotificationExists} from './Internal/Assert';

export const NotificationsModule = {
  async getById(viewerId: string, notificationId: string) {
    const notification = await Prisma.notification.findUnique({
      where: {id: notificationId},
      include: PrismaIncludes.Notification(viewerId),
    });

    assertNotificationExists(notification);

    return notification;
  },

  async getAll(viewerId: string) {
    const notifications = await Prisma.notification.findMany({
      include: PrismaIncludes.Notification(viewerId),
      where: {ownerId: viewerId},
      orderBy: {createdAt: 'desc'},
    });

    return notifications;
  },

  async getUnreadCount(viewerId: string) {
    const count = await Prisma.notification.count({where: {ownerId: viewerId}});

    return count;
  },
};
