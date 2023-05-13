import {FlatList} from 'react-native';
import ChatCard from './ChatCard/ChatCard';
import {PageContainer} from '../../../Containers';
import {Header} from '../../../Components';

const Chats: React.FC = () => {
  return (
    <PageContainer>
      <FlatList
        data={['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']}
        renderItem={() => <ChatCard />}
        ListHeaderComponent={<Header title="Messages" />}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
      />
    </PageContainer>
  );
};

export default Chats;
