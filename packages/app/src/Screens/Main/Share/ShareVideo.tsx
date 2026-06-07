import {memo, useMemo} from 'react';
import {View} from 'react-native';
import {VideoView, useVideoPlayer, VideoSource, VideoViewProps} from 'expo-video';
import {CustomStyleSheet} from '../../../Utils/CustomStyleSheet';

export type ShareVideoProps = VideoViewProps & {
  uri: string;
  ratio: number;
};

const ShareVideo: React.FC<ShareVideoProps> = (props) => {
  const {uri, ratio, ...videoProps} = props;

  const styles = getStyles(ratio);

  const source = useMemo(() => ({uri, useCaching: true}) satisfies VideoSource, [uri]);

  const videoPlayer = useVideoPlayer(source);

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
