import {VideoProps} from 'expo-av';
import {PostData} from '../../PostContent/PostContent.props';

export type PostVideoProps = (PostData & {type: 'video'}) &
  VideoProps & {
    /**
     * Is the video visible?
     * Used to play or pause the video.
     */
    visible: boolean;
  };
