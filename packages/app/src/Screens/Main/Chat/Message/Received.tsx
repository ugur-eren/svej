import {View} from 'react-native';
import type {Media} from '@svej/database';
import {Avatar, Text} from '@/Components';
import {useTheme} from '@/Hooks';
import {ChatMessage} from '@/Api/Chat/Chat.types';
import getStyles from './styles';

export type MessageReceivedProps = {
  message: ChatMessage;
  avatar?: Media | null;
};

const MessageReceived: React.FC<MessageReceivedProps> = (props) => {
  const {message, avatar} = props;

  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={styles.receivedContainer}>
      <Avatar image={avatar} style={styles.receivedAvatar} />

      <View style={styles.received}>
        <View style={styles.receivedText}>
          <Text>{message.message}</Text>
        </View>
      </View>
    </View>
  );
};

export default MessageReceived;
