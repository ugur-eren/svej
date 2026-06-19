import {FlatListProps} from 'react-native';
import {PostsApi} from '@/Api';

export type PostListProps = Partial<FlatListProps<PostsApi.Post>> & {
  type: 'explore' | 'profile';
  userId?: string;
};
