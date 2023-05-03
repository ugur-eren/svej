export type NotificationProps = {
  type: 'comment' | 'follow' | 'unfollow' | 'like' | 'comment_tag' | 'post_tag' | 'warning';
  content: string;
};
