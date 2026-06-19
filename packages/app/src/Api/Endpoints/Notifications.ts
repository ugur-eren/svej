import ApiInstance from '../ApiInstance';

export type Notification = (Awaited<ReturnType<typeof ApiInstance.notifications.get>> & {
  error: null;
})['data'][number];

export const getAll = async () => {
  return ApiInstance.notifications.get();
};

export const getUnreadCount = async () => {
  return ApiInstance.notifications.count.get();
};

export const getById = async (notificationId: string) => {
  return ApiInstance.notifications({notificationId}).get();
};
