import {Spacing, ThemedStyleSheet} from '@/Styles';

export default ThemedStyleSheet((theme) => ({
  input: {
    flex: 1,
    height: 49,
    marginLeft: Spacing.xxsmall,
  },
  editingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.normal,
    backgroundColor: theme.colors.elevated,
  },
}));
