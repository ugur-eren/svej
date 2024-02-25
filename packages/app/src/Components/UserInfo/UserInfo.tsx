import {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Avatar from '../Avatar/Avatar';
import Text from '../Text/Text';
import Timer from '../Timer/Timer';
import {useTheme} from '../../Hooks';
import {Selectors, useAppSelector} from '../../Redux';
import {MainNavigationProp} from '../../Types';
import {UserInfoProps} from './UserInfo.props';
import getStyles from './UserInfo.styles';

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const {user, small, timestamp} = props;

  const theme = useTheme();
  const navigation = useNavigation<MainNavigationProp>();
  const isSelf = useAppSelector((state) => Selectors.Auth.UserIsSelf(state, user.username));

  const styles = getStyles(theme, !!small);

  const onUserPress = () => navigation.push('Profile', {userId: user.id, username: user.username});

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={isSelf ? undefined : onUserPress}>
        <Avatar style={styles.image} avatar={user.profilePhoto?.fileKey} />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.content} onPress={isSelf ? undefined : onUserPress}>
          <View style={styles.username}>
            <Text weight="semiBold">{user.username}</Text>

            {user.tags.map((tag) => (
              <Feather
                name={tag.icon as never}
                size={small ? 12 : 16}
                color={tag.color}
                style={styles.userTag}
              />
            ))}
          </View>

          {timestamp ? <Timer timestamp={timestamp} style={styles.timer} /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(UserInfo);
