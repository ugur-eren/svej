import {ListMenuProps} from '../props';

export type ListMenuContentProps = Pick<ListMenuProps, 'anchorTitle' | 'data' | 'onItemPress'>;

export type ListMenuContentRef = {
  showMenu: () => void;
  hideMenu: () => void;
};
