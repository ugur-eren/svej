import ProfileHead from './ProfileHead/ProfileHead';
import {PageContainer, PostList} from '../../../Containers';
import {GlobalStyles} from '../../../Styles';
import {TransparentHeader} from '../../../Components';
import {ProfileScreenProps} from '../../../Types';

const Profile: React.FC<ProfileScreenProps> = ({navigation}) => {
  const onSettingsPress = () => navigation.navigate('SettingsStack', {screen: 'Settings'});

  return (
    <PageContainer>
      {/* eslint-disable-next-line react/no-unstable-nested-components */}
      <PostList style={GlobalStyles.flex1} ListHeaderComponent={ProfileHead} />

      <TransparentHeader title="ugur-eren" onSettingsPress={onSettingsPress} />
    </PageContainer>
  );
};

export default Profile;
