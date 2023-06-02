import {View, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import {useTheme} from '../../../../Hooks';
import {ChatCardProps} from './ChatCard.props';
import getStyles from './ChatCard.styles';
import {Text, Timer} from '../../../../Components';

const ChatCard: React.FC<ChatCardProps> = (props) => {
  const {onPress} = props;

  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <TouchableOpacity onPress={onPress} style={styles.userContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: `https://unsplash.it/600/600/?random=${Math.random()}`}}
          style={styles.image}
        />
        <View style={[styles.notSeen, {borderColor: theme.colors.background}]} />
      </View>

      <View style={styles.content}>
        <Text weight="semiBold" fontSize={15}>
          ugur-eren
        </Text>

        <Text numberOfLines={1}>Non duis qui quis duis enim dolor.</Text>
      </View>

      <Timer timestamp={1683523658775} variant="short" />
    </TouchableOpacity>
  );
};

export default ChatCard;
