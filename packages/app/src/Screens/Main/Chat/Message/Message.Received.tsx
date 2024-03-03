import {View} from 'react-native';
import {Avatar, Text} from '../../../../Components';
import {useTheme} from '../../../../Hooks';
import {ChatMessage} from '../../../../Api/Chat/Chat.types';
import getStyles from './Message.styles';

export type MessageReceivedProps = {
  message: ChatMessage;
  avatarKey?: string;
};

const MessageReceived: React.FC<MessageReceivedProps> = (props) => {
  const {message, avatarKey} = props;

  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={styles.receivedContainer}>
      <Avatar avatarKey={avatarKey} style={styles.receivedAvatar} />

      <View style={styles.received}>
        <View style={styles.receivedText}>
          <Text>{message.message}</Text>
        </View>
      </View>
    </View>
  );
};

export default MessageReceived;
