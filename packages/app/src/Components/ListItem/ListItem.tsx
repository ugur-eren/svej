import {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import {ListItemProps} from './ListItem.props';
import {useTheme} from '../../Hooks';

const ListItem: React.FC<ListItemProps> = (props) => {
  const {left, icon, iconColor = 'text', iconStyle, ...restProps} = props;

  const theme = useTheme();

  const ItemLeft = useCallback<Exclude<ListItemProps['left'], undefined>>(
    (leftProps) => {
      return (
        <List.Icon
          {...leftProps}
          icon={icon as string}
          color={theme.colors[iconColor]}
          style={StyleSheet.compose(iconStyle, leftProps.style)}
        />
      );
    },
    [icon, iconColor, iconStyle, theme],
  );

  return <List.Item left={left || (icon ? ItemLeft : undefined)} {...restProps} />;
};

export default ListItem;
