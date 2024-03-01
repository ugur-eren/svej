import {Comment as CommentPlaceholder} from './Comment';

export const CommentList: React.FC = () => {
  // eslint-disable-next-line react/no-array-index-key
  return Array.from({length: 10}).map((_, index) => <CommentPlaceholder key={index.toString()} />);
};
