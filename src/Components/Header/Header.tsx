import {Appbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../Hooks';
import {HeaderProps} from './Header.props';
import styles from './Header.styles';

const Header: React.FC<HeaderProps> = (props) => {
  const {title, subtitle, avatar, hideBack, ...appbarProps} = props;

  const theme = useTheme();
  const navigation = useNavigation();

  const onGoBackPress = () => {
    navigation.goBack();
  };

  return (
    <Appbar.Header elevated {...appbarProps}>
      {!hideBack && <Appbar.BackAction color={theme.colors.text} onPress={onGoBackPress} />}

      {avatar || null}

      <Appbar.Content
        style={hideBack ? styles.leftPlus : undefined}
        title={title}
        titleStyle={styles.title}
        subtitle={subtitle}
      />
    </Appbar.Header>
  );
};

export default Header;
