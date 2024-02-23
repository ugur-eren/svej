import {useEffect} from 'react';
import {useQuery} from './useQuery';
import {PostsActions, Selectors, useAppDispatch, useAppSelector} from '../Redux';
import {PostApi} from '../Api';
import {Post} from '../Api/Post/Post.types';

export const usePost = (postId: string): Post | null => {
  const post = useQuery(
    {
      queryKey: ['post', postId],
      queryFn: () => PostApi.getById(postId),
    },
    true,
  );

  const fallbackPost = useAppSelector((state) => Selectors.Posts.PostById(state, postId));

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (post.status === 'success' && post.data?.id) {
      dispatch(PostsActions.setPost(post.data));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.status === 'success']);

  return post.data || fallbackPost || null;
};
