import {FlatList} from 'react-native';
import ChatCard from './ChatCard/ChatCard';
import {PageContainer} from '../../../Containers';
import {Header} from '../../../Components';
import {useLanguage} from '../../../Hooks';
import {MainChatsScreenProps} from '../../../Typings/NavigationTypes';

const Chats: React.FC<MainChatsScreenProps> = ({navigation}) => {
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
