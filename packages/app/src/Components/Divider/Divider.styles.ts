import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {ColorNames} from '../../Types';

export default ThemedStyleSheet((theme, color: ColorNames, thickness: number) => ({
  base: {
    backgroundColor: theme.colors[color],
  },

  horizontal: {
    width: '100%',
    height: thickness,
  },
  vertical: {
    width: thickness,
    height: '100%',
  },
}));
