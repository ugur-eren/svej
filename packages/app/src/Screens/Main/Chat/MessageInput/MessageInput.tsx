import {useState} from 'react';
import {IconButton} from 'react-native-paper';
import {BottomFixedInput} from '../../../../Components';
import {useLanguage} from '../../../../Hooks';

export type MessageInputProps = {
  onSendMessage: (message: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = (props) => {
  const {onSendMessage} = props;

  const language = useLanguage();

  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim().length < 1) return;

    onSendMessage(message.trim());
    setMessage('');
  };

  return (
    <BottomFixedInput
      value={message}
      onChangeText={setMessage}
      placeholder={language.chat.message_placeholder}
      onSubmitEditing={sendMessage}
      blurOnSubmit={false}
      left={
        undefined
        /* message.length < 1 ? <IconButton icon="image" /> : null */
      }
      right={<IconButton icon="send" onPress={sendMessage} />}
    />
  );
};

export default MessageInput;
