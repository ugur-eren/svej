import {FlatList} from 'react-native';
import ChatCard from './ChatCard/ChatCard';
import {PageContainer} from '../../../Containers';
import {Header} from '../../../Components';
import {MainChatsScreenProps} from '../../../Typings/NavigationTypes';

const Chats: React.FC<MainChatsScreenProps> = ({navigation}) => {
  return (
    <PageContainer>
      <Header title="Messages" />

      <FlatList
        data={['', '', '']}
        renderItem={() => <ChatCard onPress={() => navigation.navigate('Chat')} />}
      />
    </PageContainer>
  );
};

export default Chats;
