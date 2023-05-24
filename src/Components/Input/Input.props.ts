import {StyleProp, ViewStyle, TextStyle, TextInputProps} from 'react-native';
import {FeatherIconNames} from '../../Types';

export type InputProps = TextInputProps & {
  value: string;
  placeholder: string;
  error?: string;

  leftIcon?: FeatherIconNames;
  rightIcon?: FeatherIconNames;

  small?: boolean;
  multiline?: boolean;
  type?: 'password' | 'number' | 'email';

  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;

  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIconStyle?: StyleProp<TextStyle>;
  rightIconStyle?: StyleProp<TextStyle>;
};
