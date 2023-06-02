import {FlatList} from 'react-native';
import Notification from './Notification/Notification';
import {MainHeader, Divider} from '../../../Components';
import {PageContainer} from '../../../Containers';

const Notifications: React.FC = () => {
  return (
    <PageContainer>
      <MainHeader />

      <FlatList
        data={
          ['comment', 'follow', 'unfollow', 'like', 'comment_tag', 'post_tag', 'warning'] as const
        }
        ItemSeparatorComponent={Divider}
        renderItem={({item}) => (
          <Notification
            type={item}
            content="Dolor ut ad dolore consectetur Lorem labore ad nulla mollit."
          />
        )}
      />
    </PageContainer>
  );
};

export default Notifications;
