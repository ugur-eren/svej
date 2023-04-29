import {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import {Feather} from '@expo/vector-icons';
import Text from '../Text/Text';
import {useTheme} from '../../Hooks';
import {UserInfoProps} from './UserInfo.props';
import getStyles from './UserInfo.styles';

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const {small} = props;

  const theme = useTheme();

  const styles = getStyles(theme, !!small);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{uri: 'https://source.unsplash.com/featured/200x200'}}
        />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.content}>
          <View style={styles.username}>
            <Text weight="semiBold">ugur-eren</Text>

            <Feather
              name="code"
              size={small ? 12 : 16}
              color={theme.colors.primary}
              style={styles.userTag}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(UserInfo);
