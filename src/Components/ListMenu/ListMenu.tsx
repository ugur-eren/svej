import {memo, useCallback, useRef} from 'react';
import {ListItemProps} from 'react-native-paper';
import ListItem from '../ListItem/ListItem';
import ListMenuContent from './ListMenuContent/ListMenuContent';
import {ListMenuProps} from './ListMenu.props';

const ListMenu: React.FC<ListMenuProps> = (props) => {
  const {title, iconName, anchorTitle, data, onItemPress, ...restProps} = props;

  const menuRef = useRef<ListMenuContent>(null);

  const showMenu = useCallback(() => menuRef.current?.showMenu(), [menuRef]);

  const ListRight = useCallback<Exclude<ListItemProps['right'], undefined>>(
    () => (
      <ListMenuContent
        ref={menuRef}
        anchorTitle={anchorTitle}
        data={data}
        onItemPress={onItemPress}
      />
    ),
    [anchorTitle, data, onItemPress],
  );

  return (
    <ListItem
      title={title}
      icon={iconName}
      iconColor="text"
      right={ListRight}
      onPress={showMenu}
      {...restProps}
    />
  );
};

export default memo(ListMenu);
