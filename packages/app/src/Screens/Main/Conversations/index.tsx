import {FlatList} from 'react-native';
import {PageContainer} from '@/Containers';
import {Header, Placeholders} from '@/Components';
import {useLanguage, useQuery} from '@/Hooks';
import {ChatsApi} from '@/Api';
import {ConversationsScreenProps} from '@/Types';
import ConversationCard from './ConversationCard';

const Conversations: React.FC<ConversationsScreenProps> = ({navigation}) => {
  const language = useLanguage();

  const chats = useQuery({
    queryKey: ['conversations'],
    queryFn: ChatsApi.getAllConversations,
  });

  return (
    <PageContainer>
      <Header title={language.chat.title} />

      {chats.isLoading || !chats.data ? (
        <Placeholders.ProfileWidgetList />
      ) : (
        <FlatList
          data={chats.data}
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
