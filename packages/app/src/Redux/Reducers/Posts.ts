import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {Post} from '../../Api/Post/Post.types';

export type PostsState = {
  posts: Record<string, Post>;
};

const initialState: PostsState = {
  posts: {},
};

export const PostsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    replacePosts: (state, action: PayloadAction<PostsState['posts']>) => {
      state.posts = action.payload;
    },

    addPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = {
        ...state.posts,
        ...Object.fromEntries(action.payload.map((post) => [post.id, post])),
      };
    },

    setPost: (state, action: PayloadAction<Post>) => {
      state.posts[action.payload.id] = action.payload;
    },
  },
});

export const PostsActions = PostsSlice.actions;
export const PostsReducer = PostsSlice.reducer;
