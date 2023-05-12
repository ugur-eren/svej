import {Spacing, Typography} from '../../../Styles';
import {ThemedStyleSheet} from '../../../Utils/ThemedStyleSheet';

export default ThemedStyleSheet((theme) => ({
  topContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    flexDirection: 'row',
    padding: Spacing.xxsmall,
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
    color: theme.colors.text,
    ...Typography.regular,
  },

  item: {
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.xsmall,
  },
}));
