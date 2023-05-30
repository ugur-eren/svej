import {memo} from 'react';
import PostImage from './PostImage/PostImage';
import PostVideo from './PostVideo/PostVideo';
import {PostMediaProps} from './PostMedia.props';
import {useVisibility} from '../../Hooks';

const PostMedia: React.FC<PostMediaProps> = (props) => {
  const {data, visible, style} = props;

  const visibility = useVisibility();

  // visibility can be null if the context is not provided
  // so we check against false
  const isVisible = visibility !== false && visible;

  if (data.type === 'image') return <PostImage style={style} {...data} />;

  if (data.type === 'video') return <PostVideo visible={isVisible} style={style} {...data} />;

  return null;
};

export default memo(PostMedia);
