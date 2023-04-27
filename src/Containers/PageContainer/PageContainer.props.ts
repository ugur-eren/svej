import {ViewProps, StyleProp, ViewStyle} from 'react-native';
import {Edge} from 'react-native-safe-area-context';

export interface Props extends ViewProps {
  withPadding?: boolean;
  withMargin?: boolean;
  withSafeArea?: boolean;

  edges?: ReadonlyArray<Edge>;

  containerStyle?: StyleProp<ViewStyle>;
}
