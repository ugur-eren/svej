import {ActivityIndicatorProps} from 'react-native';
import {ColorNames} from '../../Types';

export type SpinnerProps = ActivityIndicatorProps & {
  color?: ColorNames;
  size?: number | 'small' | 'large';
};
