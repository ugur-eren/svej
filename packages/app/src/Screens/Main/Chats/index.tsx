import {FlatList} from 'react-native';
import {PageContainer} from '@/Containers';
import {Header, Placeholders} from '@/Components';
import {useLanguage, useQuery} from '@/Hooks';
import {ChatsApi} from '@/Api';
import {ChatsScreenProps} from '@/Types';
import ChatCard from './ChatCard';

const Chats: React.FC<ChatsScreenProps> = ({navigation}) => {
  const language = useLanguage();

  const chats = useQuery({
    queryKey: ['chats'],
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
            <ChatCard
              username={item.participant.username}
              lastMessage={item.lastMessage}
              avatar={item.participant.profilePhoto}
              onPress={() => {
                navigation.navigate('Chat', {
                  userId: item.id,
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

export default Chats;
