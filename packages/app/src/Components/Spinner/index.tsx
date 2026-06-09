import {memo} from 'react';
import {ActivityIndicator} from 'react-native';
import {useTheme} from '@/Hooks';
import {SpinnerProps} from './props';

const Spinner: React.FC<SpinnerProps> = (props) => {
  const {color = 'primary', size, ...restProps} = props;

  const theme = useTheme();

  return <ActivityIndicator size={size || 'small'} color={theme.colors[color]} {...restProps} />;
};

export default memo(Spinner);
