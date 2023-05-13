import {FlatList} from 'react-native';
import {Divider} from 'react-native-paper';
import Notification from './Notification/Notification';
import {MainHeader} from '../../../Components';
import {PageContainer} from '../../../Containers';

const Notifications: React.FC = () => {
  return (
    <PageContainer>
      <FlatList
        data={['comment', 'follow', 'unfollow', 'like', 'comment_tag', 'post_tag', 'warning']}
        ItemSeparatorComponent={Divider}
        renderItem={({item}) => (
          <Notification
            type={item as any}
            content="Dolor ut ad dolore consectetur Lorem labore ad nulla mollit."
          />
        )}
        ListHeaderComponent={MainHeader}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
      />
    </PageContainer>
  );
};

export default Notifications;
