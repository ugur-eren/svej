import {StyleProp, ViewStyle} from 'react-native';

export type ActionButtonProps = {
  /**
   * The type of the action button.
   */
  type: 'like' | 'dislike' | 'repost';

  /**
   * The count to be displayed next to the action button.
   */
  count: number;

  /**
   * Whether the action button is active.
   */
  active?: boolean;

  /**
   * Whether the action button should have small size.
   */
  small?: boolean;

  /**
   * Whether to show loading indicator when the action button is pressed.
   */
  showLoading?: boolean;

  /**
   * Callback fired when the action button is pressed.
   */
  onPress?: () => Promise<void> | void;

  containerStyle?: StyleProp<ViewStyle>;
};
