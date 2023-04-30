import {PostMediaProps} from './PostMedia.props';
import PostImage from './PostImage/PostImage';
import PostVideo from './PostVideo/PostVideo';

const PostMedia: React.FC<PostMediaProps> = (props) => {
  const {data, visible, style} = props;

  if (data.type === 'image') return <PostImage style={style} {...data} />;

  if (data.type === 'video') return <PostVideo visible={visible} style={style} {...data} />;

  return null;
};

export default PostMedia;
