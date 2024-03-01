import {FlatList, View} from 'react-native';
import {PageContainer} from '../../../Containers';
import {Divider, Header, Placeholders, ProfileWidget} from '../../../Components';
import {useInfiniteQuery, useLanguage, useTheme} from '../../../Hooks';
import {UserApi} from '../../../Api';
import {RelationsScreenProps} from '../../../Types';
import getStyles from './Relations.styles';

const Relations: React.FC<RelationsScreenProps> = ({route}) => {
  const {userId, username, type} = route.params;

  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

  const relations = useInfiniteQuery({
    queryKey: ['relations', type, userId],
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages, lastPageParam) => {
      if (!lastPage?.length) return undefined;

      return lastPageParam + 1;
    },
    queryFn: ({pageParam}) => UserApi.getRelations(userId, type, pageParam),
  });

  return (
    <PageContainer>
      <Header title={`${username} ${language.common[type]}`} />

      {relations.isLoading || !relations.data ? (
        <Placeholders.ProfileWidgetList />
      ) : (
        <FlatList
          data={relations.data?.pages.flat() as any[]}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={Divider}
          renderItem={({item}) => (
            <View style={styles.item}>
              <ProfileWidget user={item} />
            </View>
          )}
        />
      )}
    </PageContainer>
  );
};

export default Relations;
