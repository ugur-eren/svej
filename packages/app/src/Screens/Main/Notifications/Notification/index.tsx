import {NotificationType} from '@svej/database/enums';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {Avatar, Text, Timer, Touchable} from '@/Components';
import {useLanguage, useTheme} from '@/Hooks';
import {MainNavigationProp} from '@/Types';
import {NotificationProps} from './props';
import getStyles from './styles';

const Notification: React.FC<NotificationProps> = (props) => {
  const {notification} = props;

  const theme = useTheme();
  const language = useLanguage();
  const navigation = useNavigation<MainNavigationProp>();

  const styles = getStyles(theme);

  const onNotificationPress = () => {
    // TODO: on notification press
  };

  const onUserPress = () => {
    if (!notification.user) return;

    navigation.push('Profile', {
      userId: notification.user.id,
      username: notification.user.username,
    });
  };

  const notificationContent = {
    [NotificationType.COMMENT]: notification.comment?.text || '',
    [NotificationType.FOLLOW]: '',
    [NotificationType.UNFOLLOW]: '',
    [NotificationType.POST_LIKE]: notification.post?.description || '',
    [NotificationType.COMMENT_TAG]: notification.comment?.text || '',
    [NotificationType.POST_TAG]: notification.post?.description || '',
    [NotificationType.WARNING]: '',
  }[notification.type];

  const hasUser = notification.type !== NotificationType.WARNING && !!notification.user;

  return (
    <Touchable style={styles.notification} onPress={onNotificationPress}>
      <TouchableOpacity
        onPress={notification.type === NotificationType.WARNING ? undefined : onUserPress}
      >
        {notification.type === NotificationType.WARNING ? (
          <Feather name="alert-circle" size={46} color={theme.colors.primary} />
        ) : (
          <Avatar image={notification.user.profilePhoto} style={styles.userPhoto} />
        )}
      </TouchableOpacity>

      <View style={styles.inner}>
        <Text numberOfLines={1}>
          {hasUser ? (
            <>
              <Text weight="semiBold">{notification.user.username}</Text>
              {'  '}
            </>
          ) : null}

          <Text weight={notification.type === NotificationType.WARNING ? 'semiBold' : 'regular'}>
            {language.notifications.types[notification.type]}
          </Text>
        </Text>

        {notificationContent ? <Text>{notificationContent}</Text> : null}

        <Timer timestamp={new Date(notification.createdAt).getTime()} />
      </View>
    </Touchable>
  );
};

export default Notification;
