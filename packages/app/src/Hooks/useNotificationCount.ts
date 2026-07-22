import {NotificationsApi} from '@/Api';
import {useQuery} from './useQuery';

export const useNotificationCount = () => {
  const query = useQuery({
    queryKey: ['notificationCount'],
    queryFn: NotificationsApi.getUnreadCount,
    placeholderData: {count: 0} as any,
  });

  return query.data?.count || 0;
};
