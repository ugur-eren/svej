import {FlatList} from 'react-native';
import ChatCard from './ChatCard/ChatCard';
import {PageContainer} from '../../../Containers';
import {Header} from '../../../Components';

const Chats: React.FC = () => {
  return (
    <PageContainer>
      <Header title="Messages" />

      <FlatList data={['', '', '', '']} renderItem={() => <ChatCard />} />
    </PageContainer>
  );
};

export default Chats;
