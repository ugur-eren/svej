import {NotificationApi} from '../Api';
import {useQuery} from './useQuery';

export const useNotificationCount = () => {
  const query = useQuery({
    queryKey: ['notificationCount'],
    queryFn: NotificationApi.getCount,
    placeholderData: {count: 0} as any,
  });

  return query.data?.count || 0;
};
