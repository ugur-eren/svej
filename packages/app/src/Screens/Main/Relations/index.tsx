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
    initialPageParam: 1,
    // TODO: pagination
    queryFn: ({pageParam}) =>
      (type === 'followers' ? UsersApi.getFollowers : UsersApi.getFollowing)(userId),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return undefined;
      /* if (!(lastPage as any)?.length) return undefined;

      return lastPageParam + 1; */
    },
  });

  return (
    <PageContainer>
      <Header title={`${username} ${language.common[type]}`} />

      {relations.isLoading || !relations.data ? (
        <Placeholders.ProfileWidgetList />
      ) : (
        <FlatList
          data={relations.data?.pages.flat()}
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
