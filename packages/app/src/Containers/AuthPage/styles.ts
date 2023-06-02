import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing} from '../../Styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },

  header: {
    paddingVertical: Spacing.xxlarge,
    backgroundColor: theme.colors.background,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.large,
    paddingBottom: Spacing.medium,
  },

  footerContainer: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.large,
  },
  footerButtonContainer: {
    marginBottom: Spacing.normal,
  },
}));
