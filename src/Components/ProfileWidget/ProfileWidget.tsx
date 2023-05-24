import {View, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import {useNavigation} from '@react-navigation/native';
import Text from '../Text/Text';
import TextButton from '../TextButton/TextButton';
import {useLanguage} from '../../Hooks';
import {MainNavigationProp} from '../../Typings/NavigationTypes';
import styles from './ProfileWidget.styles';

const ProfileWidget: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const language = useLanguage();

  const onUserPress = () => navigation.push('Profile');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={onUserPress}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: `https://unsplash.it/600/600/?random=${Math.random()}`}}
            style={styles.image}
          />
        </View>

        <View>
          <Text weight="semiBold" fontSize={15} style={styles.username}>
            ugur-eren
          </Text>

          <Text>Uğur Eren</Text>
        </View>
      </TouchableOpacity>

      <TextButton showLoading color="primary">
        {language.common.follow}
      </TextButton>
    </View>
  );
};

export default ProfileWidget;
