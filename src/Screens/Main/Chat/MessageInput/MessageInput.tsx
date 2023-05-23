import {useState} from 'react';
import {IconButton} from 'react-native-paper';
import {BottomFixedInput} from '../../../../Components';

const MessageInput = () => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    setMessage('');
  };

  return (
    <BottomFixedInput
      value={message}
      onChangeText={setMessage}
      placeholder="Your message..."
      onSubmitEditing={sendMessage}
      blurOnSubmit={false}
      left={false && message.length < 1 ? <IconButton icon="image" /> : null}
      right={<IconButton icon="send" onPress={sendMessage} />}
    />
  );
};

export default MessageInput;
