import * as ProfileActions from './ProfileActionsModal';
import * as PostActions from './PostActionsModal';
import * as EditPost from './EditPostModal';

export default {
  [ProfileActions.modalKey]: ProfileActions,
  [PostActions.modalKey]: PostActions,
  [EditPost.modalKey]: EditPost,
};
