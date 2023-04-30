import {StyleProp, ViewStyle} from 'react-native';

export type PaginationProps = {
  activeIndex: number;
  count: number;
  onDotPress?: (index: number) => void;

  containerStyle?: StyleProp<ViewStyle>;
};
