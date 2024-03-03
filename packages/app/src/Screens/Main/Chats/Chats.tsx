import {FlatList} from 'react-native';
import ChatCard from './ChatCard/ChatCard';
import {PageContainer} from '../../../Containers';
import {Header, Placeholders} from '../../../Components';
import {useLanguage, useQuery} from '../../../Hooks';
import {ChatApi} from '../../../Api';
import {ChatsScreenProps} from '../../../Types';

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
              avatarKey={item.profilePhoto?.fileKey}
              onPress={() => {
                navigation.navigate('Chat', {
                  userId: item.id,
                  username: item.username,
                  avatarKey: item.profilePhoto?.fileKey,
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
