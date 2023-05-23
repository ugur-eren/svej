import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing, Typography} from '../../Styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    paddingHorizontal: Spacing.small,
    ...Typography.regular,
  },
}));
