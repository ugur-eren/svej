import PostMedia from '@/Components/PostMedia';
import DoubleTapLike from '@/Components/DoubleTapLike';
import PostCarousel from './PostCarousel';
import {PostContentProps} from './props';
import styles from './styles';

const PostContent: React.FC<PostContentProps> = (props) => {
  const {data, onLike} = props;

  if (!data.length) return null;

  return (
    <DoubleTapLike onLike={onLike}>
      {data.length > 1 ? (
        <PostCarousel data={data} />
      ) : (
        <PostMedia visible data={data[0]} style={styles.post} />
      )}
    </DoubleTapLike>
  );
};

export default PostContent;
