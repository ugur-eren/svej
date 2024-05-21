import {memo, useState} from 'react';
import {View, TouchableOpacity, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Video, ResizeMode} from 'expo-av';
import {Feather} from '@expo/vector-icons';
import Text from '../../Text/Text';
import Spinner from '../../Spinner/Spinner';
import {useDimensions, usePromisedState, useTheme} from '../../../Hooks';
import {Selectors, SettingsActions, useAppDispatch, useAppSelector} from '../../../Redux';
import {PostVideoProps} from './PostVideo.props';
import getStyles from './PostVideo.styles';

const PostVideo: React.FC<PostVideoProps> = (props) => {
  const {uri, ratio, poster, visible, style, ...videoProps} = props;

  const theme = useTheme();

  const dispatch = useAppDispatch();
  const muted = useAppSelector(Selectors.Settings.Muted);

  const styles = getStyles(theme);

  const {width} = useDimensions();
  const [renderVideo, setRenderVideo] = usePromisedState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  const onVideoPress = () => dispatch(SettingsActions.toggleMuted());

  const onVideoReady = () => setReady(true);

  const onVideoError = (err: string) => {
    if (err) setError(true);
  };

  const tryAgain = async () => {
    // TODO: Currently it's re-mounts the Video component to reload the video.
    // This is not viable.
    await setRenderVideo(false);

    setRenderVideo(true);
    setReady(false);
    setError(false);
  };

  return (
    <TouchableWithoutFeedback disabled={!renderVideo} onPress={onVideoPress}>
      <View>
        {renderVideo ? (
          <Video
            source={{uri}}
            style={StyleSheet.compose(style, {height: width / ratio, aspectRatio: ratio})}
            videoStyle={{width, height: width / ratio}}
            isLooping
            usePoster
            shouldPlay={visible}
            isMuted={muted}
            posterSource={{uri: poster, width, height: width / ratio}}
            resizeMode={ResizeMode.CONTAIN}
            onReadyForDisplay={onVideoReady}
            onError={onVideoError}
            {...videoProps}
          />
        ) : null}

        {error ? (
          <View style={styles.loader}>
            <TouchableOpacity onPress={tryAgain} style={styles.errorTouchable}>
              <Text style={styles.errorText}>
                Video couldn&apos;t loaded.{'\n'}Press to try again.
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!ready ? (
          <View style={styles.loader}>
            <Spinner size={36} color="primary" />
          </View>
        ) : null}

        {muted ? (
          <View style={styles.mutedContainer}>
            <Feather name="volume-x" size={24} color={theme.colors.white} style={styles.muted} />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(PostVideo);
