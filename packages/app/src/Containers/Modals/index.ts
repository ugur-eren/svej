import * as ProfileActions from './ProfileActionsModal';
import * as PostActions from './PostActionsModal';
import * as EditPost from './EditPostModal';
import * as CommentActions from './CommentActionsModal';

export default {
  [ProfileActions.modalKey]: ProfileActions,
  [PostActions.modalKey]: PostActions,
  [EditPost.modalKey]: EditPost,
  [CommentActions.modalKey]: CommentActions,
};
