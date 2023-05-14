import {useState} from 'react';
import {StyleSheet, TextInput, View, ViewProps} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IconButton} from 'react-native-paper';
import {InputAccessoryView} from '../../../../Components';
import {useTheme} from '../../../../Hooks';
import getStyles from './MessageInput.styles';

const MessageInput: React.FC<ViewProps> = ({style: styleProp, ...containerProps}) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');

  const styles = getStyles(theme);

  const sendMessage = () => {
    setMessage('');
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={StyleSheet.compose(styles.container, styleProp)}
      {...containerProps}
    >
      <InputAccessoryView style={styles.container}>
        <View style={styles.container}>
          {false && message.length < 1 ? <IconButton icon="image" /> : null}

          <TextInput
            style={styles.input}
            placeholder="Your message..."
            placeholderTextColor={theme.colors.textLight}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />

          <IconButton icon="send" onPress={sendMessage} />
        </View>
      </InputAccessoryView>
    </SafeAreaView>
  );
};

export default MessageInput;
