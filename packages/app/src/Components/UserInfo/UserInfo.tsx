import {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Text from '../Text/Text';
import Timer from '../Timer/Timer';
import {useTheme} from '../../Hooks';
import {MainNavigationProp} from '../../Types';
import {UserInfoProps} from './UserInfo.props';
import getStyles from './UserInfo.styles';

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const {small, timestamp} = props;

  const theme = useTheme();
  const navigation = useNavigation<MainNavigationProp>();

  const styles = getStyles(theme, !!small);

  const onUserPress = () => navigation.push('Profile');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={onUserPress}>
        <Image
          style={styles.image}
          source={{uri: 'https://source.unsplash.com/featured/200x200'}}
        />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.content} onPress={onUserPress}>
          <View style={styles.username}>
            <Text weight="semiBold">ugur-eren</Text>

            <Feather
              name="code"
              size={small ? 12 : 16}
              color={theme.colors.primary}
              style={styles.userTag}
            />
          </View>

          {timestamp ? <Timer timestamp={timestamp} style={styles.timer} /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(UserInfo);
