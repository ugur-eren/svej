import {StyleProp, ViewStyle} from 'react-native';

export type ActionButtonProps = {
  type: 'like' | 'dislike' | 'repost';
  count: number;
  active?: boolean;
  small?: boolean;
  showLoading?: boolean;

  onPress?: () => Promise<void> | void;

  containerStyle?: StyleProp<ViewStyle>;
};
