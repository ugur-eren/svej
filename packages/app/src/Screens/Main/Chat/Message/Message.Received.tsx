import {View} from 'react-native';
import {Image} from 'expo-image';
import {Text} from '../../../../Components';
import {useTheme} from '../../../../Hooks';
import getStyles from './Message.styles';

const MessageReceived: React.FC = () => {
  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={styles.receivedContainer}>
      <Image
        source={{uri: `https://unsplash.it/600/600/?random=${Math.random()}`}}
        style={styles.receivedAvatar}
      />

      <View style={styles.received}>
        <View style={styles.receivedText}>
          <Text>Aliquip consequat aliquip minim laboris non veniam.</Text>
        </View>
      </View>
    </View>
  );
};

export default MessageReceived;
