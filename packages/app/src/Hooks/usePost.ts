import {useEffect} from 'react';
import {PostsActions, Selectors, useAppDispatch, useAppSelector} from '@/Redux';
import {PostsApi} from '@/Api';
import {useQuery} from './useQuery';

export const usePost = (postId: string): PostsApi.Post | null => {
  const post = useQuery({
    queryKey: ['post', postId],
    queryFn: () => PostsApi.getById(postId),
  });

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
