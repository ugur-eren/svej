import {useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {MainHeader, Divider, Placeholders} from '@/Components';
import {PageContainer} from '@/Containers';
import {useInfiniteQuery} from '@/Hooks';
import {NotificationsApi} from '@/Api';
import Notification from './Notification';

const Notifications: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const notifications = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({pageParam}) => NotificationsApi.getAll(pageParam),
    select: (data) => data.pages.map((page) => page.notifications).flat(),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextPageParam = lastPage?.nextCursor;
      if (nextPageParam && nextPageParam !== lastPageParam) {
        return nextPageParam;
      }
      return undefined;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await notifications.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageContainer>
      <MainHeader />

      {notifications.isLoading || !notifications.data ? (
        <Placeholders.NotificationList />
      ) : (
        <FlatList
          data={notifications.data}
          ItemSeparatorComponent={Divider}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <Notification notification={item} />}
        />
      )}
    </PageContainer>
  );
};

export default Notifications;
