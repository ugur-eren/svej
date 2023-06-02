import Color from 'color';
import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing} from '../../Styles';

export default ThemedStyleSheet((theme) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: Color(theme.dark ? theme.colors.black : theme.colors.white)
        .alpha(0.5)
        .toString(),
      gap: Spacing.xxxsmall,
      paddingHorizontal: Spacing.xsmall,
      paddingVertical: Spacing.xxsmall,
      borderRadius: 99,
    },

    dotContainer: {
      // Half of the gap, so the total gap will be gap * 2
      padding: Spacing.xxxsmall / 2,
    },
    dot: {
      width: 9,
      height: 9,
      borderRadius: 9,
    },
    activeDot: {
      backgroundColor: theme.colors.primary,
    },
    inactiveDot: {
      backgroundColor: theme.dark ? theme.colors.white : theme.colors.black,
      transform: [{scale: 0.7}],
    },
  };
});
