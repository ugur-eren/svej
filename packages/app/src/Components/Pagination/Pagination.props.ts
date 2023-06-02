import {StyleProp, ViewStyle} from 'react-native';

export type PaginationProps = {
  /**
   * The active index of the dot.
   */
  activeIndex: number;

  /**
   * The count of the dots in the pagination.
   */
  count: number;

  /**
   * Callback fired when a dots is pressed.
   */
  onDotPress?: (index: number) => void;

  containerStyle?: StyleProp<ViewStyle>;
};
