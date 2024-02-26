import {forwardRef, memo, useEffect, useImperativeHandle, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Text from '../Text/Text';
import {useShowApiError} from '../../Hooks/useShowApiError';
import {useTheme} from '../../Hooks/Theming';
import {PostApi} from '../../Api';
import {PostUploaderRef} from './PostUploader.types';
import getStyles from './PostUploader.styles';

type PostUploader = PostUploaderRef;
const PostUploader = memo(
  forwardRef((props, ref) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const showApiError = useShowApiError();
    const [active, setActive] = useState(false);
    const [step, setStep] = useState<'idle' | 'uploading' | 'processing'>('idle');

    const progress = useSharedValue(0);
    const opacity = useSharedValue(0.75);

    useEffect(() => {
      if (active) {
        opacity.value = withRepeat(withTiming(1, {duration: 1000}), -1, true);
      } else {
        opacity.value = 0.75;
      }

      return () => {
        opacity.value = 0.75;
      };
    }, [active, opacity]);

    const progressStyle = useAnimatedStyle(() => {
      return {
        ...styles.progressBar,
        width: `${progress.value}%`,
        opacity: opacity.value,
      };
    });

    const uploadPost: PostUploaderRef['uploadPost'] = async (description, medias) => {
      setActive(true);
      setStep('uploading');

      try {
        const result = await PostApi.createPost(
          {description, medias},
          {
            timeout: 0,
            onUploadProgress: (progressEvent) => {
              // TODO: onUploadProgress never gets triggered. Couldn't find a solution.

              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
              );
              progress.value = percentCompleted * 0.75;

              if (percentCompleted === 100) {
                setStep('processing');
                progress.value = withSequence(
                  withTiming(85, {duration: 5_000}),
                  withTiming(90, {duration: 10_000}),
                  withTiming(95, {duration: 15_000}),
                  withTiming(100, {duration: 100_000}),
                );
              }
            },
          },
        );
        if (!result.ok) throw result.data;
        return true;
      } catch (error) {
        showApiError(error as Error);
        return false;
      } finally {
        // Reset the progress
        progress.value = 0;
        setStep('idle');
        setActive(false);
      }
    };

    useImperativeHandle(ref, () => ({
      uploadPost,
      active,
    }));

    if (!active) return null;

    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
          <Animated.View style={progressStyle} />

          <View style={styles.content}>
            <Text fontSize={12}>
              {step === 'uploading' ? 'Uploading' : null}
              {step === 'processing' ? 'Processing your post' : null}
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }),
);

export default PostUploader;
