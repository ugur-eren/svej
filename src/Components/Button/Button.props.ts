import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ColorNames} from '../../Typings';

export type ButtonProps = {
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
   * Theme color name or array of color strings (not color names!).
   * If color name is provided, the button will have the provided solid background color.
   * If array of colors is provided, the button will have a gradient background.
   */
  backgroundColor?: ColorNames | string[];

  /**
   * Theme color name for the button text color
   */
  color?: ColorNames;

  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
};
