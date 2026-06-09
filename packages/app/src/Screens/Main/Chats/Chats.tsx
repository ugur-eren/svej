import {FlatList} from 'react-native';
import {PageContainer} from '@/Containers';
import {Header, Placeholders} from '@/Components';
import {useLanguage, useQuery} from '@/Hooks';
import {ChatApi} from '@/Api';
import {ChatsScreenProps} from '@/Types';
import ChatCard from './ChatCard/ChatCard';

const Chats: React.FC<ChatsScreenProps> = ({navigation}) => {
  const language = useLanguage();

  const chats = useQuery({
    queryKey: ['chats'],
    queryFn: ChatApi.getChats,
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
              username={item.username}
              lastMessage={item.lastMessage}
              avatar={item.profilePhoto}
              onPress={() => {
                navigation.navigate('Chat', {
                  userId: item.id,
                  username: item.username,
                  avatar: item.profilePhoto,
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
