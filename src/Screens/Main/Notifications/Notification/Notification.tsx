import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {Image} from 'expo-image';
import {Text, Timer, Touchable} from '../../../../Components';
import {useTheme} from '../../../../Hooks';
import {NotificationProps} from './Notification.props';
import getStyles from './Notification.styles';
import {RootStackNavigationProps} from '../../../../Typings/NavigationTypes';

const Notification: React.FC<NotificationProps> = (props) => {
  const {type, content} = props;

  const theme = useTheme();
  const navigation = useNavigation<RootStackNavigationProps>();

  const styles = getStyles(theme);

  const onUserPress = () => {
    navigation.navigate('MainStack', {screen: 'Profile'});
  };

  return (
    <Touchable style={styles.notification}>
      <TouchableOpacity onPress={onUserPress}>
        {type === 'warning' ? (
          <Feather name="alert-circle" size={46} color={theme.colors.primary} />
        ) : (
          <Image
            source={{uri: `https://unsplash.it/600/600/?random=${Math.random()}`}}
            style={styles.userPhoto}
          />
        )}
      </TouchableOpacity>

      <View style={styles.inner}>
        <Text numberOfLines={1}>
          {type === 'warning' ? null : (
            <>
              <Text weight="semiBold">ugur-eren</Text>
              {'  '}
            </>
          )}

          <Text weight={type === 'warning' ? 'semiBold' : 'regular'}>
            {
              {
                comment: 'made a comment on your post',
                follow: 'started following you',
                unfollow: 'unfollowed you',
                like: 'liked your post',
                comment_tag: 'tagged you in a comment',
                post_tag: 'tagged you in a post',
                warning: 'You got a warning!',
              }[type]
            }
          </Text>
        </Text>
        {content ? <Text>{content}</Text> : null}
        <Timer timestamp={1683146227536} />
      </View>
    </Touchable>
  );
};

export default Notification;
