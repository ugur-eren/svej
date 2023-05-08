import {ViewProps} from 'react-native';
import {TimeVariant} from '../../Utils/Timestamp';

export type TimerProps = ViewProps & {
  timestamp: number;
  variant?: TimeVariant;
};
