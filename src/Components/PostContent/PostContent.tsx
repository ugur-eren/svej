import PostCarousel from './PostCarousel/PostCarousel';
import PostMedia from '../PostMedia/PostMedia';
import {PostContentProps} from './PostContent.props';
import styles from './PostContent.styles';

const PostContent: React.FC<PostContentProps> = (props) => {
  const {data} = props;

  if (data.length > 1) {
    return <PostCarousel data={data} />;
  }

  return <PostMedia visible data={data[0]} style={styles.post} />;
};

export default PostContent;
