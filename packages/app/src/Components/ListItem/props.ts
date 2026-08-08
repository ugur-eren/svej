import {ListIconProps, ListItemProps as PaperListItemProps} from 'react-native-paper';
import {ColorNames, FeatherIconNames} from '@/Types';

export type ListItemProps = PaperListItemProps & {
  /**
   * Icon name to be displayed on the left side of the list item.
   *
   * Ignored if `left` prop is provided.
   */
  icon?: FeatherIconNames;

  iconColor?: ColorNames;
  iconStyle?: ListIconProps['style'];
};
