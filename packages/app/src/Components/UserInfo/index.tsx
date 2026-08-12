import {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {IconButton} from 'react-native-paper';
import Avatar from '@/Components/Avatar';
import Text from '@/Components/Text';
import Timer from '@/Components/Timer';
import {useTheme} from '@/Hooks';
import {Selectors, useAppSelector} from '@/Redux';
import {IsIOS} from '@/Utils/Helpers';
import {MainNavigationProp} from '@/Types';
import {UserInfoProps} from './props';
import getStyles from './styles';

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const {user, small, timestamp, onActionsPress} = props;

  const theme = useTheme();
  const navigation = useNavigation<MainNavigationProp>();
  const isSelf = useAppSelector((state) => Selectors.Auth.UserIsSelf(state, user.username));

  const styles = getStyles(theme, !!small);

  const onUserPress = () => navigation.push('Profile', {userId: user.id, username: user.username});

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={isSelf ? undefined : onUserPress}>
        <Avatar style={styles.image} image={user.profilePhoto} />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.content} onPress={isSelf ? undefined : onUserPress}>
          <View style={styles.username}>
            <Text weight="semiBold">{user.username}</Text>

            {user.tags.map((tag) => (
              <Feather
                key={tag.id}
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

      {onActionsPress ? (
        <IconButton
          icon={IsIOS ? 'more-horizontal' : 'more-vertical'}
          size={21}
          onPress={onActionsPress}
        />
      ) : null}
    </View>
  );
};

export default memo(UserInfo);
