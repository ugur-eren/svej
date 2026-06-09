import {Config, Zod} from '@svej/common';
import {useState} from 'react';
import {IconButton} from 'react-native-paper';
import {BottomFixedInput} from '@/Components';
import {useLanguage, useShowToast} from '@/Hooks';
import {parseLanguageParts} from '@/Utils/Helpers';

export type MessageInputProps = {
  onSendMessage: (message: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = (props) => {
  const {onSendMessage} = props;

  const language = useLanguage();
  const showToast = useShowToast();

  const [message, setMessage] = useState('');

  const onChangeText = (text: string) => {
    if (text.length > Config.chatMessageMaxLength) {
      setMessage(text.slice(0, Config.chatMessageMaxLength));
      return;
    }

    if (text.split(/\r\n|\r|\n/).length > Config.chatMessageMaxLines) {
      const lines = text.split(/\r\n|\r|\n/).slice(0, Config.chatMessageMaxLines);
      setMessage(lines.join('\n'));
      return;
    }

    setMessage(text);
  };

  const sendMessage = () => {
    if (message.trim().length < 1) return;

    const messageValidation = Zod.Chat.Message.safeParse(message);
    if (!messageValidation.success) {
      let toastTitle = language.chat.couldnt_send_title;
      let toastMessage = language.chat.couldnt_send_message;

      const issue = messageValidation.error.issues[0];
      if (issue) {
        if (issue.code === 'too_big') {
          toastTitle = language.chat.message_too_long_title;
          toastMessage = parseLanguageParts(language.chat.message_too_long_message, {
            max: Config.chatMessageMaxLength,
          });
        }
        if (issue.code === 'custom' && issue.message === 'too_many_lines') {
          toastTitle = language.chat.message_too_many_lines_title;
          toastMessage = parseLanguageParts(language.chat.message_too_many_lines_message, {
            max: Config.chatMessageMaxLines,
          });
        }
      }

      showToast({
        title: toastTitle,
        message: toastMessage,
        type: 'error',
      });
      return;
    }

    onSendMessage(messageValidation.data);
    setMessage('');
  };

  return (
    <BottomFixedInput
      value={message}
      onChangeText={onChangeText}
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
