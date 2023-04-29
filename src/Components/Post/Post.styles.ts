import {Spacing} from '../../Styles';
import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';

export default ThemedStyleSheet((theme) => ({
  container: {
    width: '100%',
    backgroundColor: theme.colors.surface,
  },

  description: {
    padding: Spacing.small,
  },

  bottom: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xsmall,
  },
  actionButtons: {
    flexDirection: 'row',
  },

  divider: {
    marginBottom: Spacing.small,
  },
  comments: {
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xsmall,
  },
}));
