import MessageReceived from './Message.Received';
import MessageSent from './Message.Sent';
import {ChatMessage} from '../../../../Api/Chat/Chat.types';

export type MessageProps = {
  type: 'received' | 'sent';
  message: ChatMessage;
  sending?: boolean;
  userAvatarKey?: string;
};

const Message: React.FC<MessageProps> = (props) => {
  const {type, message, sending, userAvatarKey} = props;

  if (type === 'received') return <MessageReceived message={message} avatarKey={userAvatarKey} />;

  return <MessageSent message={message} sending={sending} />;
};

export default Message;
