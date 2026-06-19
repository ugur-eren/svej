import type {ChatMessage, Media} from '@svej/database';

export type ChatCardProps = {
  username: string;
  lastMessage?: ChatMessage | null;
  avatar?: Media | null;

  onPress?: () => void | Promise<void>;
};
