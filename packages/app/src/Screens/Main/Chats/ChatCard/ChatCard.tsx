import {View, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../../Hooks';
import {ChatCardProps} from './ChatCard.props';
import getStyles from './ChatCard.styles';
import {Avatar, Text, Timer} from '../../../../Components';

const ChatCard: React.FC<ChatCardProps> = (props) => {
  const {onPress, username, lastMessage, avatarKey} = props;

  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <TouchableOpacity onPress={onPress} style={styles.userContainer}>
      <View style={styles.imageContainer}>
        <Avatar avatarKey={avatarKey} style={styles.image} />
        <View style={[styles.notSeen, {borderColor: theme.colors.background}]} />
      </View>

      <View style={styles.content}>
        <Text weight="semiBold" fontSize={15}>
          {username}
        </Text>

        <Text numberOfLines={1}>{lastMessage?.message}</Text>
      </View>

      <Timer timestamp={new Date(lastMessage?.createdAt || Date.now()).getTime()} variant="short" />
    </TouchableOpacity>
  );
};

export default ChatCard;
