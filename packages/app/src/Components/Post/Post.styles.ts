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
    marginBottom: Spacing.xxsmall,
  },
  comments: {
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xsmall,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxsmall,
  },
  commentAuthor: {},
  commentText: {},
}));
