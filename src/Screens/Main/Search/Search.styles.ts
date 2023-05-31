import {Spacing, Typography} from '../../../Styles';
import {ThemedStyleSheet} from '../../../Utils/ThemedStyleSheet';

export default ThemedStyleSheet((theme) => ({
  topContainer: {
    backgroundColor: theme.colors.elevated,
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
    backgroundColor: theme.colors.surface,
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.xsmall,
  },
}));
