import {FeatherIconNames} from '../../Types';
import {ListItemProps} from '../ListItem/ListItem.props';

export type ListMenuProps = ListItemProps & {
  title: string;
  iconName: FeatherIconNames;
  anchorTitle: string;
  data: Record<string, string>;
  onItemPress: (key: string) => void;
};
