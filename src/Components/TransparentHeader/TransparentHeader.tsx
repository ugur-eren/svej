import {} from 'react-native';
import {Appbar, Surface} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../Hooks';
import {IsIOS} from '../../Utils/Helpers';
import {TransparentHeaderProps} from './TransparentHeader.props';
import styles from './TransparentHeader.styles';

const TransparentHeader: React.FC<TransparentHeaderProps> = (props) => {
  const {title, subtitle, hideBack, onSettingsPress, onMorePress} = props;

  const theme = useTheme();
  const navigation = useNavigation();

  const onGoBackPress = () => {
    navigation.goBack();
  };

  return (
    <Surface mode="flat" elevation={2} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.inner}>
        {hideBack ? null : (
          <Appbar.BackAction
            size={22}
            color={theme.colors.text}
            onPress={onGoBackPress}
            style={styles.backButton}
          />
        )}

        <Appbar.Content
          style={hideBack ? styles.leftPlus : styles.leftMinus}
          color={theme.colors.text}
          title={title}
          titleStyle={styles.title}
          subtitle={subtitle}
        />

        {onSettingsPress ? (
          <Appbar.Action
            size={22}
            icon="settings"
            color={theme.colors.text}
            onPress={onSettingsPress}
          />
        ) : null}

        {onMorePress ? (
          <Appbar.Action
            size={22}
            icon={IsIOS ? 'more-horizontal' : 'more-vertical'}
            color={theme.colors.text}
            onPress={onMorePress}
          />
        ) : null}
      </SafeAreaView>
    </Surface>
  );
};

export default TransparentHeader;
