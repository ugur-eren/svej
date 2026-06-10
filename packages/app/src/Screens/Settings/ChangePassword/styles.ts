import {Spacing, ThemedStyleSheet} from '@/Styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    padding: Spacing.pagePadding,
  },
}));
