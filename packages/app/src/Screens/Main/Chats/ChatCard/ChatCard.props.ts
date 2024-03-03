import {ChatMessage} from 'database';

export type ChatCardProps = {
  username: string;
  lastMessage?: ChatMessage;
  avatarKey?: string;

  onPress?: () => void | Promise<void>;
};
