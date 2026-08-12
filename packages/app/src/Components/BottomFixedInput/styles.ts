import {Spacing, Typography, ThemedStyleSheet} from '@/Styles';

export default ThemedStyleSheet((theme) => ({
  surface: {
    backgroundColor: theme.colors.surface,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    paddingHorizontal: Spacing.small,
    ...Typography.regular,
  },
}));
