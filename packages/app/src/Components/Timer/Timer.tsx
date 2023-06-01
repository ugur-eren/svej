import {memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Feather} from '@expo/vector-icons';
import Text from '../Text/Text';
import {useCurrentTime, useLanguage, useTheme} from '../../Hooks';
import {TimerProps} from './Timer.props';
import styles from './Timer.styles';
import {getTimeStringFromTimestamp} from '../../Utils/Timestamp';

const Timer: React.FC<TimerProps> = (props) => {
  const {timestamp, variant = 'ago', style: styleProp, ...restProps} = props;

  const theme = useTheme();
  const language = useLanguage();
  const currentTime = useCurrentTime();

  const time = useMemo(
    () => getTimeStringFromTimestamp(language, timestamp, currentTime || Date.now(), variant),
    [language, timestamp, currentTime, variant],
  );

  return (
    <View style={StyleSheet.compose(styles.container, styleProp)} {...restProps}>
      <Feather name="clock" size={13} style={styles.icon} color={theme.colors.text} />
      <Text>{time}</Text>
    </View>
  );
};

export default memo(Timer);
