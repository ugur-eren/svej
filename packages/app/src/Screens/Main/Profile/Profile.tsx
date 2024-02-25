import ProfileHead from './ProfileHead/ProfileHead';
import {PageContainer, PostList} from '../../../Containers';
import {TransparentHeader} from '../../../Components';
import {Selectors, useAppSelector} from '../../../Redux';
import {GlobalStyles} from '../../../Styles';
import {ProfileScreenProps} from '../../../Types';

const Profile: React.FC<ProfileScreenProps> = ({navigation, route}) => {
  const {userId, username} = route.params;

  const isSelf = useAppSelector((state) => Selectors.Auth.UserIsSelf(state, username));

  const onSettingsPress = () => navigation.navigate('SettingsStack', {screen: 'Settings'});

  const onMorePress = () => {
    // TODO: more press
  };

  return (
    <PageContainer>
      <PostList
        type="profile"
        userId={userId}
        style={GlobalStyles.flex1}
        ListHeaderComponent={<ProfileHead username={username} />}
      />

      <TransparentHeader
        title={username}
        onSettingsPress={isSelf ? onSettingsPress : undefined}
        onMorePress={isSelf ? undefined : onMorePress}
      />
    </PageContainer>
  );
};

export default Profile;
