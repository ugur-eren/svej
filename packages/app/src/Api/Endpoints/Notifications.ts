import ApiInstance from '../ApiInstance';

export type Notification = (Awaited<ReturnType<typeof getById>> & {
  error: null;
})['data'];

export const getAll = async (cursor?: string) => {
  return ApiInstance.notifications.get({query: {cursor}});
};

export const getUnreadCount = async () => {
  return ApiInstance.notifications.count.get();
};

export const getById = async (notificationId: string) => {
  return ApiInstance.notifications({notificationId}).get();
};
