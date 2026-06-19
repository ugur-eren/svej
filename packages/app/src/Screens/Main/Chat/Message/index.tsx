import type {Media} from '@svej/database';
import {ChatsApi} from '@/Api';
import MessageReceived from './Received';
import MessageSent from './Sent';

export type MessageProps = {
  type: 'received' | 'sent';
  message: ChatsApi.ChatMessage;
  sending?: boolean;
  userAvatar?: Media | null;
};

const Message: React.FC<MessageProps> = (props) => {
  const {type, message, sending, userAvatar} = props;

  if (type === 'received') return <MessageReceived message={message} avatar={userAvatar} />;

  return <MessageSent message={message} sending={sending} />;
};

export default Message;
