import PostCarousel from './PostCarousel/PostCarousel';
import PostMedia from '../PostMedia/PostMedia';
import DoubleTapLike from '../DoubleTapLike/DoubleTapLike';
import {PostContentProps} from './PostContent.props';
import styles from './PostContent.styles';

const PostContent: React.FC<PostContentProps> = (props) => {
  const {data} = props;

  if (!data.length) return null;

  return (
    <DoubleTapLike>
      {data.length > 1 ? (
        <PostCarousel data={data} />
      ) : (
        <PostMedia visible data={data[0]} style={styles.post} />
      )}
    </DoubleTapLike>
  );
};

export default PostContent;
