import {FlatListProps} from 'react-native';
import {Post} from '../../Api/Post/Post.types';

export type PostListProps = Partial<FlatListProps<Post>> & {
  type: 'explore' | 'profile';
  userId?: string;
};
