import {CommentsApi} from '@/Api';

export type CommentProps = {
  comment: CommentsApi.Comment;

  onEditPress: () => void;
};
