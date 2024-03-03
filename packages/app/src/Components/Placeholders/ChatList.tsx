import {Chat as ChatPlaceholder} from './Chat';

export const ChatList: React.FC = () => {
  return Array.from({length: 5}).map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <ChatPlaceholder key={index.toString()} />
  ));
};
