import Color from 'color';
import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing, Typography} from '../../Styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    backgroundColor: Color(theme.colors.elevated).alpha(0.7).toString(),
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.7,
    width: '100%',
  },
  inner: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    ...Typography.semiBold,
  },
  backButton: {
    marginRight: Spacing.normal,
  },
  leftPlus: {
    left: Spacing.xxsmall,
  },
  leftMinus: {
    left: -Spacing.medium,
  },
}));
