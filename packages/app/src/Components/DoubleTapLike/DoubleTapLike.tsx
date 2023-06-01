import {useMemo, memo} from 'react';
import {View} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import {Feather} from '@expo/vector-icons';
import {useTheme} from '../../Hooks';
import {DoubleTapLikeProps} from './DoubleTapLike.props';
import getStyles from './DoubleTapLike.styles';

const DoubleTapLike: React.FC<DoubleTapLikeProps> = (props) => {
  const {children, onLike} = props;

  const theme = useTheme();

  const animation = useSharedValue(0);

  const doubleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .onStart(() => {
          animation.value = withSequence(
            withTiming(1, {
              easing: Easing.elastic(1.2),
              duration: 500,
            }),
            withDelay(
              200,
              withTiming(0, {
                easing: Easing.elastic(1.2),
                duration: 250,
              }),
            ),
          );

          if (onLike) runOnJS(onLike)();
        }),
    [animation, onLike],
  );

  const animatedContainer = useAnimatedStyle(() => ({
    opacity: animation.value,
  }));

  const animatedIcon = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(animation.value, [0, 1], [180, 0])}deg`,
      },
      {scale: animation.value},
    ],
  }));

  const styles = getStyles(theme);

  return (
    <GestureDetector gesture={doubleTapGesture}>
      <View>
        {children}

        <Animated.View style={[styles.container, animatedContainer]} pointerEvents="none">
          <Animated.View style={animatedIcon}>
            <Feather name="thumbs-up" size={64} color={theme.colors.success} />
          </Animated.View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

export default memo(DoubleTapLike);
