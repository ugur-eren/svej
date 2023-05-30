import {memo, forwardRef, useState, useCallback, useImperativeHandle} from 'react';
import {TouchableOpacity} from 'react-native';
import {Menu} from 'react-native-paper';
import {Feather} from '@expo/vector-icons';
import Text from '../../Text/Text';
import {useTheme} from '../../../Hooks';
import {ListMenuContentRef, ListMenuContentProps} from './ListMenuContent.props';
import styles from './ListMenuContent.styles';

type ListMenuContent = ListMenuContentRef;

const ListMenuContent = memo(
  forwardRef<ListMenuContentRef, ListMenuContentProps>((props, ref) => {
    const {anchorTitle, data, onItemPress} = props;

    const [menuActive, setMenuActive] = useState(false);

    const theme = useTheme();

    const showMenu = useCallback(() => setMenuActive(true), []);
    const hideMenu = useCallback(() => setMenuActive(false), []);

    useImperativeHandle(ref, () => ({
      showMenu,
      hideMenu,
    }));

    return (
      <Menu
        visible={menuActive}
        onDismiss={hideMenu}
        anchor={
          <TouchableOpacity onPress={showMenu} style={styles.anchorTouchable}>
            <>
              <Text weight="semiBold" fontSize={16} style={styles.anchorTitle}>
                {anchorTitle}
              </Text>

              <Feather name="chevron-down" size={20} color={theme.colors.text} />
            </>
          </TouchableOpacity>
        }
      >
        {Object.entries(data).map(([key, value]) => (
          <Menu.Item
            key={key}
            title={value}
            onPress={() => {
              hideMenu();
              onItemPress(key);
            }}
          />
        ))}
      </Menu>
    );
  }),
);

export default ListMenuContent;
