import {ListIconProps, ListItemProps as PaperListItemProps} from 'react-native-paper';
import {ColorNames, FeatherIconNames} from '../../Types';

export type ListItemProps = PaperListItemProps & {
  /**
   * Icon name to be displayed on the left side of the list item.
   */
  icon?: FeatherIconNames;

  iconColor?: ColorNames;
  iconStyle?: ListIconProps['style'];
};
