import {FlatList} from 'react-native';
import ChatCard from './ChatCard/ChatCard';
import {PageContainer} from '../../../Containers';
import {Header} from '../../../Components';
import {useLanguage} from '../../../Hooks';
import {ChatsScreenProps} from '../../../Types';

const Chats: React.FC<ChatsScreenProps> = ({navigation}) => {
  const language = useLanguage();

  return (
    <PageContainer>
      <Header title={language.chat.title} />

      <FlatList
        data={['', '', '']}
        renderItem={() => <ChatCard onPress={() => navigation.navigate('Chat')} />}
      />
    </PageContainer>
  );
};

export default Chats;
