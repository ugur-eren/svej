import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing} from '../../Styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.elevated,
    borderRadius: 6,
    paddingVertical: Spacing.xxxsmall,
    paddingHorizontal: Spacing.small,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginBottom: Spacing.xxsmall,
  },
  closeButtonContainer: {
    width: 26,
    height: 26,
    borderRadius: 99,
    overflow: 'hidden',
  },
  closeButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    paddingVertical: 2,
  },

  // types
  info: {
    borderLeftWidth: 6,
    borderColor: theme.colors.info,
  },
  success: {
    borderLeftWidth: 6,
    borderColor: theme.colors.success,
  },
  warning: {
    borderLeftWidth: 6,
    borderColor: theme.colors.warning,
  },
  error: {
    borderLeftWidth: 6,
    borderColor: theme.colors.error,
  },
}));
