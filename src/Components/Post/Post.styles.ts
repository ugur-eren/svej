import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing} from '../../Styles';

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
    paddingLeft: Spacing.xxsmall,
    paddingRight: Spacing.small,
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.medium,
  },

  divider: {
    marginBottom: Spacing.small,
  },
  comments: {
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xsmall,
  },
}));
