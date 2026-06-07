import {VideoViewProps} from 'expo-video';
import {PostData} from '../../PostContent/PostContent.props';

export type PostVideoProps = (PostData & {type: 'video'}) &
  VideoViewProps & {
    /**
     * Is the video visible?
     * Used to play or pause the video.
     */
    visible: boolean;
  };
