import {FlatList, View} from 'react-native';
import {PageContainer} from '@/Containers';
import {Divider, Header, Placeholders, ProfileWidget} from '@/Components';
import {useInfiniteQuery, useLanguage, useTheme} from '@/Hooks';
import {UsersApi} from '@/Api';
import {RelationsScreenProps} from '@/Types';
import getStyles from './styles';

const Relations: React.FC<RelationsScreenProps> = ({route}) => {
  const {userId, username, type} = route.params;

  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

  const relations = useInfiniteQuery({
    queryKey: ['relations', type, userId],
    queryFn: ({pageParam}) =>
      (type === 'followers' ? UsersApi.getFollowers : UsersApi.getFollowing)(userId, pageParam),
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

  return (
    <PageContainer>
      <Header title={`${username} ${language.common[type]}`} />

      {relations.isLoading || !relations.data ? (
        <Placeholders.ProfileWidgetList />
      ) : (
        <FlatList
          data={relations.data}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={Divider}
          renderItem={({item}) => (
            <View style={styles.item}>
              <ProfileWidget user={item as UsersApi.Author} />
            </View>
          )}
        />
      )}
    </PageContainer>
  );
};

export default Relations;
