import {SvgProps} from 'react-native-svg';
import {SharedValue} from 'react-native-reanimated';
import {ColorNames} from '../../Typings';

export type CircleProgressProps = SvgProps & {
  /**
   * Progress value between 0 and 1
   */
  progress: SharedValue<number>;

  /**
   * Radius of the circle
   */
  radius: number;

  /**
   * Stroke width of the circle
   */
  strokeWidth: number;

  color?: ColorNames;
};
