import {View, StyleSheet, ViewProps} from 'react-native';
import LinearGradient, {LinearGradientProps} from 'react-native-linear-gradient';

type Props<T extends string | string[]> = {
  /**
   * A string color or an array of string colors
   */
  colors: T;
} & (T extends string ? ViewProps : LinearGradientProps);

/**
 * Renders a LinearGradient if colors is an array, otherwise renders a View.
 * Not necessarily needed, but it's a nice abstraction since some components
 * may receive a color or an array of colors like the Button component.
 * And it's a bit expensive to render a LinearGradient when it's not needed.
 */
const GradientOrView = <T extends string | string[]>({colors, ...props}: Props<T>) => {
  const isString = typeof colors === 'string';

  if (isString || colors.length === 1) {
    return (
      <View
        {...props}
        style={StyleSheet.compose({backgroundColor: isString ? colors : colors[0]}, props.style)}
      />
    );
  }

  return <LinearGradient colors={colors} {...props} />;
};

export default GradientOrView;
