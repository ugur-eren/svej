import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '../../Components';
import {useLanguage, useTheme} from '../../Hooks';
import getStyles from './styles';

export type AuthPageHeaderProps = {
  /**
   * Title to show under the logo
   */
  title: string;
};

const Header: React.FC<AuthPageHeaderProps> = ({title}) => {
  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

  return (
    <View style={styles.header}>
      <SafeAreaView edges={['top']} style={styles.headerContent}>
        <Text weight="EarWorm" color="primary" fontSize={64} lineHeight={92}>
          {language.appName}
        </Text>

        <Text weight="semiBold" fontSize={20}>
          {title}
        </Text>
      </SafeAreaView>
    </View>
  );
};

export default Header;
