import {View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {Text} from '../../../../Components';
import {useTheme} from '../../../../Hooks';
import {ChatMessage} from '../../../../Api/Chat/Chat.types';
import getStyles from './Message.styles';

const MessageSent: React.FC<{message: ChatMessage; sending?: boolean}> = ({message, sending}) => {
  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={styles.sentContainer}>
      <View style={styles.sent}>
        <View style={styles.sentText}>
          <Text color="onPrimary">{message.message}</Text>
        </View>

        {sending ? (
          <Feather name="send" color={theme.colors.text} size={14} style={styles.sendingIcon} />
        ) : null}
      </View>
    </View>
  );
};

export default MessageSent;
