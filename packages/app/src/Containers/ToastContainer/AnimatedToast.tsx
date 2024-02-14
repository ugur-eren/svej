import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {clamp, snapPoint} from 'react-native-redash';
import {ToastConfig, useHideToast} from '../../Hooks/useToast';
import {Toast} from '../../Components';

export const AnimatedToast: React.FC<{toast: ToastConfig}> = ({toast}) => {
  const hideToast = useHideToast();

  const containerRef = useAnimatedRef<Animated.View>();

  const top = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange(({translationY}) => {
      translateY.value = clamp(translationY, -999, 0);
    })
    .onEnd(({velocityY}) => {
      const bounds = measure(containerRef);
      const height = bounds?.height ?? 0;

      const snapTo = snapPoint(translateY.value, velocityY, [-height, 0]);

      if (snapTo < 0) {
        top.value = withTiming(1, {duration: 200}, () => {
          runOnJS(hideToast)(toast.key);
        });
      }

      translateY.value = withTiming(snapTo, {duration: 200});
    });

  const animatedStyle = useAnimatedStyle(() => ({
    top: `-${top.value * 100}%`,
    transform: [{translateY: translateY.value}],
  }));

  const onDismiss = () => {
    'worklet';

    top.value = withTiming(1, {duration: 200}, () => {
      runOnJS(hideToast)(toast.key);
    });
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View ref={containerRef} style={animatedStyle}>
        <Toast {...toast} onDismiss={onDismiss} />
      </Animated.View>
    </GestureDetector>
  );
};
