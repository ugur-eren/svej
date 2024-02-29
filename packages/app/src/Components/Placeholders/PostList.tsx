import {Post as PostPlaceholder} from './Post';

export const PostList: React.FC = () => {
  // eslint-disable-next-line react/no-array-index-key
  return Array.from({length: 3}).map((_, index) => <PostPlaceholder key={index.toString()} />);
};
