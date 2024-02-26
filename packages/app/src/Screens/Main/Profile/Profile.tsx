import ProfileHead from './ProfileHead/ProfileHead';
import {PageContainer, PostList} from '../../../Containers';
import {TransparentHeader} from '../../../Components';
import {Selectors, useAppSelector} from '../../../Redux';
import {GlobalStyles} from '../../../Styles';
import {BottomProfileScreenProps, ProfileScreenProps} from '../../../Types';

const Profile: React.FC<ProfileScreenProps & BottomProfileScreenProps> = ({navigation, route}) => {
  const {hideBack} = route.params;
  let {userId, username} = route.params;

  /**
   * If userId and username are not provided, use the current user's id and username
   */
  const user = useAppSelector(Selectors.Auth.User);
  if (!userId && !username) {
    userId = user?.id;
    username = user?.username;
  }

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
        ListHeaderComponent={<ProfileHead userId={userId} username={username} />}
      />

      <TransparentHeader
        title={username}
        onSettingsPress={isSelf ? onSettingsPress : undefined}
        onMorePress={isSelf ? undefined : onMorePress}
        hideBack={hideBack}
      />
    </PageContainer>
  );
};

export default Profile;
