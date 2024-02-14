import {View} from 'react-native';
import {Surface} from 'react-native-paper';
import {Feather} from '@expo/vector-icons';
import Text from '../Text/Text';
import Touchable from '../Touchable/Touchable';
import {useTheme} from '../../Hooks';
import {ToastProps} from './Toast.props';
import getStyles from './Toast.styles';

const Toast: React.FC<ToastProps> = (props) => {
  const {type = 'info', title, message, onDismiss} = props;

  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <Surface elevation={2} style={[styles.container, styles[type]]}>
      <View style={styles.top}>
        <Text weight="semiBold" style={styles.title}>
          {title}
        </Text>

        <View style={styles.closeButtonContainer}>
          <Touchable onPress={onDismiss} style={styles.closeButton}>
            <Feather name="x" color={theme.colors.text} />
          </Touchable>
        </View>
      </View>

      <Text fontSize={12} weight="medium" style={styles.message}>
        {message}
      </Text>
    </Surface>
  );
};

export default Toast;
