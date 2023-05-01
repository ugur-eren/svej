import {ThemedStyleSheet} from '../../../../Utils/ThemedStyleSheet';
import {Spacing} from '../../../../Styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    flex: 1,
    padding: Spacing.small,
    paddingBottom: 0,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingHorizontal: Spacing.small,
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingTop: Spacing.xxxsmall,
  },
}));
