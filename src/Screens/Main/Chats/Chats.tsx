import {FlatList} from 'react-native';
import ChatCard from './ChatCard/ChatCard';
import {PageContainer} from '../../../Containers';
import {Header} from '../../../Components';
import {MainChatsScreenProps} from '../../../Typings/NavigationTypes';

const Chats: React.FC<MainChatsScreenProps> = ({navigation}) => {
  return (
    <PageContainer>
      <FlatList
        data={['', '', '']}
        renderItem={() => <ChatCard onPress={() => navigation.navigate('Chat')} />}
        ListHeaderComponent={<Header title="Messages" />}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
      />
    </PageContainer>
  );
};

export default Chats;
