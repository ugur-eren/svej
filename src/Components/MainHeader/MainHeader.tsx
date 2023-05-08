import {TouchableOpacity} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Text from '../Text/Text';
import {useLanguage, useTheme} from '../../Hooks';
import {MainNavigationProp} from '../../Typings/NavigationTypes';
import {MainHeaderProps} from './MainHeader.props';
import GlobalStyles from '../../Styles/GlobalStyles';

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const {onLogoPress} = props;

  const theme = useTheme();
  const language = useLanguage();
  const navigation = useNavigation<MainNavigationProp>();

  const onSearchPress = () => navigation.navigate('Search');

  const onChatPress = () => {
    // TODO: Navigate to chat screen
  };

  return (
    <Appbar.Header elevated>
      <Appbar.Action size={22} icon="search" color={theme.colors.text} onPress={onSearchPress} />

      <TouchableOpacity
        disabled={typeof onLogoPress !== 'function'}
        onPress={onLogoPress}
        style={GlobalStyles.flex1}
      >
        <Text weight="EarWorm" color="primary" align="center" fontSize={32}>
          {language.appName}
        </Text>
      </TouchableOpacity>

      <Appbar.Action size={22} icon="send" color={theme.colors.text} onPress={onChatPress} />
    </Appbar.Header>
  );
};

export default MainHeader;
