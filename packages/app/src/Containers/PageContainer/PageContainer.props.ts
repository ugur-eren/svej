import {ViewProps, StyleProp, ViewStyle} from 'react-native';
import {Edge} from 'react-native-safe-area-context';

export interface Props extends ViewProps {
  /**
   * Whether the page should have padding.
   */
  withPadding?: boolean;

  /**
   * Whether the page should have margin.
   */
  withMargin?: boolean;

  /**
   * Whether the page should have safe area insets applied.
   */
  withSafeArea?: boolean;

  /**
   * Edges of the safe area insets to apply (only applies when `withSafeArea` is `true`).
   */
  edges?: ReadonlyArray<Edge>;

  containerStyle?: StyleProp<ViewStyle>;
}
