import {ChatsApi, MediasApi} from '@/Api';

export type ConversationCardProps = {
  username: string;
  lastMessage?: ChatsApi.ChatMessage | null;
  avatar?: MediasApi.Avatar | null;

  onPress?: () => void | Promise<void>;
};
