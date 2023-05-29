import {useState} from 'react';
import {IconButton} from 'react-native-paper';
import {BottomFixedInput} from '../../../../Components';
import {useLanguage} from '../../../../Hooks';

const MessageInput = () => {
  const language = useLanguage();

  const [message, setMessage] = useState('');

  const sendMessage = () => {
    setMessage('');
  };

  return (
    <BottomFixedInput
      value={message}
      onChangeText={setMessage}
      placeholder={language.chat.message_placeholder}
      onSubmitEditing={sendMessage}
      blurOnSubmit={false}
      left={message.length < 1 ? <IconButton icon="image" /> : null}
      right={<IconButton icon="send" onPress={sendMessage} />}
    />
  );
};

export default MessageInput;
