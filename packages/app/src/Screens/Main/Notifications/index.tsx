import {useCallback, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {MainHeader, Divider, Placeholders} from '@/Components';
import {PageContainer} from '@/Containers';
import {useInfiniteQuery} from '@/Hooks';
import {NotificationsApi} from '@/Api';
import Notification from './Notification';

const Notifications: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const notifications = useInfiniteQuery({
    initialPageParam: Date.now().toString(),
    queryKey: ['notifications'],
    // TODO: pagination
    queryFn: async ({pageParam}) => NotificationsApi.getAll(),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return undefined;
      /* if (!(lastPage as any)?.length) return undefined;
      const pageParam = (lastPage as any)[(lastPage as any).length - 1].createdAt;
      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam; */
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await notifications.refetch();
    } finally {
      setRefreshing(false);
    }
  }, [notifications]);

  return (
    <PageContainer>
      <MainHeader />

      {notifications.isLoading || !notifications.data ? (
        <Placeholders.NotificationList />
      ) : (
        <FlatList
          data={notifications.data?.pages.flat()}
          ItemSeparatorComponent={Divider}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => <Notification notification={item} />}
        />
      )}
    </PageContainer>
  );
};

export default Notifications;
