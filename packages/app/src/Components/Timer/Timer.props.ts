import {ViewProps} from 'react-native';
import {TimeVariant} from '../../Utils/Timestamp';

export type TimerProps = ViewProps & {
  /**
   * The timestamp to be converted and displayed.
   */
  timestamp: number;

  /**
   * The variant of the time string to be displayed.
   * Will show "ago" by default.
   * @type {TimeVariant}
   */
  variant?: TimeVariant;
};
