import {StyleProp, ViewStyle, TextStyle, TextInputProps} from 'react-native';
import {FeatherIconNames} from '../../Types';

export type InputProps = TextInputProps & {
  /**
   * Error message to be displayed.
   * If this prop is not provided or is undefined, no error message will be displayed.
   */
  error?: string;

  /**
   * Icon name to be displayed on the left side of the input.
   */
  leftIcon?: FeatherIconNames;
  /**
   * Icon name to be displayed on the right side of the input.
   */
  rightIcon?: FeatherIconNames;

  /**
   * Whether the input should have small size.
   */
  small?: boolean;

  /**
   * Whether the input should be multiline.
   */
  multiline?: boolean;

  /**
   * Type of the input.
   *
   * **"password"** will make the input masked and show/hide icon will be displayed.
   *
   * **"number"** will make the input numeric and will show numeric keyboard.
   *
   * **"email"** will show email keyboard.
   */
  type?: 'password' | 'number' | 'email';

  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;

  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIconStyle?: StyleProp<TextStyle>;
  rightIconStyle?: StyleProp<TextStyle>;
};
