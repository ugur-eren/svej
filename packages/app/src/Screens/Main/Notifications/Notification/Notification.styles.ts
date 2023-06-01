import {ThemedStyleSheet} from '../../../../Utils/ThemedStyleSheet';
import {Spacing} from '../../../../Styles';

export default ThemedStyleSheet((theme) => ({
  notification: {
    flexDirection: 'row',
    padding: Spacing.xsmall,
    backgroundColor: theme.colors.surface,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  inner: {
    marginLeft: Spacing.small,
    flex: 1,
    justifyContent: 'center',
  },
}));
