import {View, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import Text from '../Text/Text';
import TextButton from '../TextButton/TextButton';
import styles from './ProfileWidget.styles';

const ProfileWidget: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable}>
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
        Follow
      </TextButton>
    </View>
  );
};

export default ProfileWidget;
