/* eslint-disable no-param-reassign */

import {memo, useEffect} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {useEvent} from 'expo';
import {VideoView, useVideoPlayer} from 'expo-video';
import {Image} from 'expo-image';
import {Feather} from '@expo/vector-icons';
import Text from '@/Components/Text';
import Spinner from '@/Components/Spinner';
import {useTheme} from '@/Hooks';
import {Selectors, SettingsActions, useAppDispatch, useAppSelector} from '@/Redux';
import {PostVideoProps} from './props';
import getStyles from './styles';

const PostVideo: React.FC<PostVideoProps> = (props) => {
  const {uri, ratio, blurhash, visible, style, ...videoProps} = props;

  const theme = useTheme();

  const dispatch = useAppDispatch();
  const muted = useAppSelector(Selectors.Settings.Muted);

  const styles = getStyles(theme, ratio);

  const videoPlayer = useVideoPlayer({uri, useCaching: true}, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (visible && !videoPlayer.playing) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    videoPlayer.muted = muted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  const {status} = useEvent(videoPlayer, 'statusChange', {status: videoPlayer.status});

  const onVideoPress = () => dispatch(SettingsActions.toggleMuted());

  return (
    <TouchableWithoutFeedback disabled={status === 'error'} onPress={onVideoPress}>
      <View>
        <View style={styles.video}>
          <VideoView
            player={videoPlayer}
            style={StyleSheet.compose(style, styles.video)}
            contentFit="contain"
            nativeControls={false}
            {...videoProps}
          />

          {status === 'loading' && blurhash ? (
            <Image
              source={{blurhash, width: Math.round(32 * ratio), height: 32}}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          ) : null}
        </View>

        {status === 'error' ? (
          <View style={styles.loader}>
            <Text style={styles.errorText}>Video couldn&apos;t loaded.</Text>
          </View>
        ) : null}

        {status === 'loading' ? (
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
