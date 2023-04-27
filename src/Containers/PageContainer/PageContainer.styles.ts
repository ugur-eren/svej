import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing} from '../../Styles';

export default ThemedStyleSheet((theme, withPadding: boolean, withMargin: boolean) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,

    ...(withPadding ? {paddingHorizontal: Spacing.pagePadding} : {}),
    ...(withMargin ? {marginHorizontal: Spacing.pagePadding} : {}),
  },
}));
