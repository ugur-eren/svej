import {useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {UsersApi} from '@/Api';
import {Divider, Header, Placeholders, ProfileWidget, TextButton} from '@/Components';
import {PageContainer} from '@/Containers';
import {useInfiniteQuery, useLanguage, useMutation, useShowToast, useTheme} from '@/Hooks';
import {SettingsBlockedUsersScreenProps} from '@/Types';
import getStyles from './styles';

const BlockedUsers: React.FC<SettingsBlockedUsersScreenProps> = () => {
  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

  const showToast = useShowToast();

  const [refreshing, setRefreshing] = useState(false);

  const blockedUsers = useInfiniteQuery({
    queryKey: ['blockedUsers'],
    queryFn: ({pageParam}) => UsersApi.getBlocked(pageParam),
    select: (data) => data.pages.map((page) => page.users).flat(),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextPageParam = lastPage?.nextCursor;
      if (nextPageParam && nextPageParam !== lastPageParam) {
        return nextPageParam;
      }
      return undefined;
    },
  });

  const unblock = useMutation({
    mutationKey: ['unblock'],
    mutationFn: UsersApi.unblock,
  });

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await blockedUsers.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageContainer>
      <Header title={language.settings.blocked_users} />

      {blockedUsers.isLoading || !blockedUsers.data ? (
        <Placeholders.ProfileWidgetList />
      ) : (
        <FlatList
          data={blockedUsers.data}
          onEndReachedThreshold={0.2}
          onEndReached={() => blockedUsers.fetchNextPage()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={styles.item}>
              <ProfileWidget
                user={item.blocked}
                right={
                  <TextButton
                    showLoading
                    color="primary"
                    onPress={async () => {
                      await unblock.mutateAsync(item.blocked.id, {
                        onSuccess: () => {
                          showToast({
                            title: language.profile.unblock_success_title,
                            message: language.profile.unblock_success_message,
                            type: 'success',
                          });

                          blockedUsers.refetch();
                        },
                      });
                    }}
                  >
                    {language.profile.unblock}
                  </TextButton>
                }
              />
            </View>
          )}
          ItemSeparatorComponent={Divider}
          contentContainerStyle={styles.flatList}
        />
      )}
    </PageContainer>
  );
};

export default BlockedUsers;
