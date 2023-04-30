import {TouchableOpacity} from 'react-native';
import {Appbar} from 'react-native-paper';
import Text from '../Text/Text';
import {useLanguage, useTheme} from '../../Hooks';
import {MainHeaderProps} from './MainHeader.props';
import GlobalStyles from '../../Styles/GlobalStyles';

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const {onLogoPress} = props;

  const theme = useTheme();
  const language = useLanguage();

  return (
    <Appbar.Header elevated>
      <Appbar.Action size={22} icon="search" color={theme.colors.text} />

      <TouchableOpacity onPress={onLogoPress} style={GlobalStyles.flex1}>
        <Text weight="EarWorm" color="primary" align="center" fontSize={32}>
          {language.appName}
        </Text>
      </TouchableOpacity>

      <Appbar.Action size={22} icon="send" color={theme.colors.text} />
    </Appbar.Header>
  );
};

export default MainHeader;
