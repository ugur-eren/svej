import {useCallback, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import Notification from './Notification/Notification';
import {MainHeader, Divider} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useInfiniteQuery} from '../../../Hooks';
import {NotificationApi} from '../../../Api';

const Notifications: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const notifications = useInfiniteQuery({
    initialPageParam: Date.now().toString(),
    queryKey: ['notifications'],
    getNextPageParam: (lastPage: any, allPages, lastPageParam) => {
      if (!lastPage?.length) return undefined;
      const pageParam = lastPage[lastPage.length - 1].createdAt;
      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam;
    },
    queryFn: async ({pageParam}) => NotificationApi.getAll(pageParam),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await notifications.refetch();
    } catch (error) {
      //
    } finally {
      setRefreshing(false);
    }
  }, [notifications]);

  // TODO: Show loading indicator
  if (!notifications.data) return null;

  return (
    <PageContainer>
      <MainHeader />

      <FlatList
        data={notifications.data?.pages.flat() as any[]}
        ItemSeparatorComponent={Divider}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <Notification notification={item} />}
      />
    </PageContainer>
  );
};

export default Notifications;
