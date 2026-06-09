import type {Media} from '@svej/database';
import {ChatMessage} from '@/Api/Chat/Chat.types';
import MessageReceived from './Message.Received';
import MessageSent from './Message.Sent';

export type MessageProps = {
  type: 'received' | 'sent';
  message: ChatMessage;
  sending?: boolean;
  userAvatar?: Media | null;
};

const Message: React.FC<MessageProps> = (props) => {
  const {type, message, sending, userAvatar} = props;

  if (type === 'received') return <MessageReceived message={message} avatar={userAvatar} />;

  return <MessageSent message={message} sending={sending} />;
};

export default Message;
