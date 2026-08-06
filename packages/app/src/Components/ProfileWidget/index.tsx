import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Avatar from '@/Components/Avatar';
import Text from '@/Components/Text';
import TextButton from '@/Components/TextButton';
import {useLanguage} from '@/Hooks';
import {MainNavigationProp} from '@/Types';
import {ProfileWidgetProps} from './props';
import styles from './styles';

const ProfileWidget: React.FC<ProfileWidgetProps> = ({user, right}) => {
  const navigation = useNavigation<MainNavigationProp>();
  const language = useLanguage();

  const onUserPress = () => navigation.push('Profile', {userId: user.id, username: user.username});

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={onUserPress}>
        <View style={styles.imageContainer}>
          <Avatar image={user.profilePhoto} style={styles.image} />
        </View>

        <View>
          <Text weight="semiBold" fontSize={15} style={styles.username}>
            {user.username}
          </Text>

          <Text>{user.fullname}</Text>
        </View>
      </TouchableOpacity>

      {!right && !user.isFollowing ? (
        <TextButton showLoading color="primary">
          {language.common.follow}
        </TextButton>
      ) : null}

      {right}
    </View>
  );
};

export default ProfileWidget;
