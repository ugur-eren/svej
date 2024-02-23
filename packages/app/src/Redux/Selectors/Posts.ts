import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';

export const Posts = (state: RootState) => state.posts.posts;

export const PostById = createSelector(
  [Posts, (_state, id: string) => id],
  (posts, id) => posts[id],
);
