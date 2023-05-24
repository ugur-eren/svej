import {ListIconProps, ListItemProps as PaperListItemProps} from 'react-native-paper';
import {ColorNames, FeatherIconNames} from '../../Types';

export type ListItemProps = PaperListItemProps & {
  icon?: FeatherIconNames;
  iconColor?: ColorNames;
  iconStyle?: ListIconProps['style'];
};
