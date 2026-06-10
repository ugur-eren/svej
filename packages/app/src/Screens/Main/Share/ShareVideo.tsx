import {memo} from 'react';
import {View} from 'react-native';
import {VideoView, useVideoPlayer, VideoViewProps} from 'expo-video';
import {CustomStyleSheet} from '@/Styles';

export type ShareVideoProps = VideoViewProps & {
  uri: string;
  ratio: number;
};

const ShareVideo: React.FC<ShareVideoProps> = (props) => {
  const {uri, ratio, ...videoProps} = props;

  const styles = getStyles(ratio);

  const videoPlayer = useVideoPlayer({uri});

  return (
    <View>
      <VideoView
        player={videoPlayer}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        {...videoProps}
      />
    </View>
  );
};

const getStyles = CustomStyleSheet((aspectRatio: number) => ({
  video: {
    width: '100%',
    aspectRatio,
  },
}));

export default memo(ShareVideo);
