import ProfileHead from './ProfileHead/ProfileHead';
import {PageContainer, PostList} from '../../../Containers';
import {GlobalStyles} from '../../../Styles';

const Profile: React.FC = () => {
  return (
    <PageContainer>
      {/* eslint-disable-next-line react/no-unstable-nested-components */}
      <PostList style={GlobalStyles.flex1} ListHeaderComponent={() => <ProfileHead />} />
    </PageContainer>
  );
};

export default Profile;
