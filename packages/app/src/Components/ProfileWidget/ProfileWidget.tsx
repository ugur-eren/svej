import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Avatar from '../Avatar/Avatar';
import Text from '../Text/Text';
import TextButton from '../TextButton/TextButton';
import {useLanguage} from '../../Hooks';
import {MainNavigationProp} from '../../Types';
import {ProfileWidgetProps} from './ProfileWidget.props';
import styles from './ProfileWidget.styles';

const ProfileWidget: React.FC<ProfileWidgetProps> = ({user}) => {
  const navigation = useNavigation<MainNavigationProp>();
  const language = useLanguage();

  const onUserPress = () => navigation.push('Profile', {userId: user.id, username: user.username});

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={onUserPress}>
        <View style={styles.imageContainer}>
          <Avatar avatarKey={user.profilePhoto?.fileKey} style={styles.image} />
        </View>

        <View>
          <Text weight="semiBold" fontSize={15} style={styles.username}>
            {user.username}
          </Text>

          <Text>{user.fullname}</Text>
        </View>
      </TouchableOpacity>

      {!user.isFollowing ? (
        <TextButton showLoading color="primary">
          {language.common.follow}
        </TextButton>
      ) : null}
    </View>
  );
};

export default ProfileWidget;
