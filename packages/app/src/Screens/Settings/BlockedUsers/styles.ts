import {Spacing, ThemedStyleSheet} from '@/Styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
  },
  flatList: {
    padding: Spacing.pagePadding,
  },
  item: {
    paddingVertical: Spacing.xsmall,
  },
}));
