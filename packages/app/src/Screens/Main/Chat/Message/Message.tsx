import MessageReceived from './Message.Received';
import MessageSent from './Message.Sent';

const Message: React.FC<{type: 'received' | 'sent'}> = (props) => {
  const {type} = props;

  if (type === 'received') return <MessageReceived />;

  return <MessageSent />;
};

export default Message;
