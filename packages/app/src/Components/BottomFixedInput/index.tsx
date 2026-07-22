import {memo} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useReanimatedKeyboardAnimation} from 'react-native-keyboard-controller';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {Surface} from 'react-native-paper';
import {useTheme} from '@/Hooks';
import {BottomFixedInputProps} from './props';
import getStyles from './styles';

const BottomFixedInput: React.FC<BottomFixedInputProps> = (props) => {
  const {left, right, containerProps, style: styleProp, ...inputProps} = props;

  const insets = useSafeAreaInsets();
  const {height, progress} = useReanimatedKeyboardAnimation();

  const theme = useTheme();

  const styles = getStyles(theme);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      paddingBottom:
        Math.abs(height.value) + interpolate(progress.value, [0, 1], [insets.bottom, 0]),
    };
  }, [height, progress, insets.bottom]);

  return (
    <Surface elevation={2} mode="elevated">
      <Animated.View
        {...containerProps}
        style={[styles.container, containerProps?.style, animatedStyle]}
      >
        {left}

        <TextInput
          style={StyleSheet.compose(styles.input, styleProp)}
          placeholderTextColor={theme.colors.textLight}
          keyboardAppearance={theme.dark ? 'dark' : 'default'}
          {...inputProps}
        />

        {right}
      </Animated.View>
    </Surface>
  );
};

export default memo(BottomFixedInput);
