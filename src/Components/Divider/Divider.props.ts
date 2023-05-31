import {ViewProps} from 'react-native';
import {ColorNames} from '../../Types';

export type DividerProps = ViewProps & {
  /**
   * Whether the divider is horizontal or vertical.
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * The color of the divider.
   * @default 'background'
   */
  color?: ColorNames;

  /**
   * The thickness of the divider.
   * @default hairlineWidth
   */
  thickness?: number;
};
