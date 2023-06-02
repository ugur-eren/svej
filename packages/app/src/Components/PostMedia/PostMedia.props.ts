import {ImageStyle} from 'expo-image';
import {PostData} from '../PostContent/PostContent.props';

export type PostMediaProps = {
  data: PostData;

  /**
   * Is the media visible?
   * Used to play or pause the video.
   */
  visible: boolean;

  style?: ImageStyle;
};
