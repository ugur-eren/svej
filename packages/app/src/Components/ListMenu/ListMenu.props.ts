import {FeatherIconNames} from '../../Types';
import {ListItemProps} from '../ListItem/ListItem.props';

export type ListMenuProps = ListItemProps & {
  /**
   * The title to be displayed in the list item.
   */
  title: string;

  /**
   * The icon name to be displayed in the list item.
   */
  iconName: FeatherIconNames;

  /**
   * The title to be displayed in the anchor.
   */
  anchorTitle: string;

  /**
   * Data of the menu.
   */
  data: Record<string, string>;

  /**
   * Callback fired when an item is pressed.
   */
  onItemPress: (key: string) => void;
};
