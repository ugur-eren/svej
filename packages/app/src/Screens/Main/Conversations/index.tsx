import {useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {PageContainer} from '@/Containers';
import {Header, Placeholders} from '@/Components';
import {useInfiniteQuery, useLanguage} from '@/Hooks';
import {ChatsApi} from '@/Api';
import {ConversationsScreenProps} from '@/Types';
import ConversationCard from './ConversationCard';

const Conversations: React.FC<ConversationsScreenProps> = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);

  const language = useLanguage();

  const conversations = useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: async ({pageParam}) => ChatsApi.getAllConversations(pageParam),
    select: (data) => data.pages.map((page) => page.conversations).flat(),
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
      await conversations.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageContainer>
      <Header title={language.chat.title} />

      {conversations.isLoading || !conversations.data ? (
        <Placeholders.ProfileWidgetList />
      ) : (
        <FlatList
          data={conversations.data}
          onEndReachedThreshold={0.2}
          onEndReached={() => conversations.fetchNextPage()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <ConversationCard
              username={item.participant.username}
              lastMessage={item.lastMessage}
              avatar={item.participant.profilePhoto}
              onPress={() => {
                navigation.navigate('Chat', {
                  conversationId: item.id,
                  userId: item.participant.id,
                  username: item.participant.username,
                  avatar: item.participant.profilePhoto,
                });
              }}
            />
          )}
        />
      )}
    </PageContainer>
  );
};

export default Conversations;
