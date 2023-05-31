import Color from 'color';
import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing, Typography} from '../../Styles';
import {IsAndroid} from '../../Utils/Helpers';

export default ThemedStyleSheet((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: IsAndroid
      ? Color(theme.colors.elevated).alpha(0.8).toString()
      : theme.colors.transparent,
  },
  blurContainer: {
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
