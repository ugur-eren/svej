import {TouchableOpacityProps} from 'react-native';
import {TextProps} from '../Text/Text.props';

export type TextButtonProps = TouchableOpacityProps & {
  /**
   * The text to display inside the button
   */
  title: string;

  /**
   * Whether the loading indicator should show when the button is pressed
   */
  showLoading?: boolean;

  /**
   * Function to execute on button press
   */
  onPress?: () => void | Promise<void>;

  /**
   * Props to pass to the Text component
   */
  textProps?: Omit<TextProps, 'children'>;
};
