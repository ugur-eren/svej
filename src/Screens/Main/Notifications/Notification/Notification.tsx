import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {Image} from 'expo-image';
import {Text, Timer, Touchable} from '../../../../Components';
import {useLanguage, useTheme} from '../../../../Hooks';
import {MainNavigationProp} from '../../../../Types';
import {NotificationProps} from './Notification.props';
import getStyles from './Notification.styles';

const Notification: React.FC<NotificationProps> = (props) => {
  const {type, content} = props;

  const theme = useTheme();
  const language = useLanguage();
  const navigation = useNavigation<MainNavigationProp>();

  const styles = getStyles(theme);

  const onUserPress = () => navigation.push('Profile');

  return (
    <Touchable style={styles.notification}>
      <TouchableOpacity onPress={type === 'warning' ? undefined : onUserPress}>
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
            {language.notifications.types[type]}
          </Text>
        </Text>

        {content ? <Text>{content}</Text> : null}

        <Timer timestamp={1683146227536} />
      </View>
    </Touchable>
  );
};

export default Notification;
