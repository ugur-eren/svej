import {ActivityIndicatorProps} from 'react-native';
import {ColorNames} from '../../Typings';

export type SpinnerProps = ActivityIndicatorProps & {
  color?: ColorNames;
  size?: number | 'small' | 'large';
};
