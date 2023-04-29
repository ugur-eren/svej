import {memo} from 'react';
import {View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import Text from '../Text/Text';
import {useTheme} from '../../Hooks';
import {TimerProps} from './Timer.props';
import styles from './Timer.styles';

const Timer: React.FC<TimerProps> = (props) => {
  const {timestamp} = props;

  const theme = useTheme();

  const time = '2 hours ago';

  return (
    <View style={styles.container}>
      <Feather name="clock" size={13} style={styles.icon} color={theme.colors.text} />
      <Text>{time}</Text>
    </View>
  );
};

export default memo(Timer);
