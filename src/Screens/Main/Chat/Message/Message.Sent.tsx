import {useState} from 'react';
import {View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {Text} from '../../../../Components';
import {useOnMount, useTheme} from '../../../../Hooks';
import getStyles from './Message.styles';

const MessageSent: React.FC = () => {
  const theme = useTheme();
  const [sending, setSending] = useState(true);

  const styles = getStyles(theme);

  useOnMount(() => {
    setTimeout(() => setSending(false), Math.random() * 3000);
  });

  return (
    <View style={styles.sentContainer}>
      <View style={styles.sent}>
        <View style={styles.sentText}>
          <Text color="onPrimary">
            Voluptate fugiat ex veniam occaecat ad culpa et eu ad est ex veniam.
          </Text>
        </View>

        {sending ? (
          <Feather name="send" color={theme.colors.text} size={14} style={styles.sendingIcon} />
        ) : null}
      </View>
    </View>
  );
};

export default MessageSent;
