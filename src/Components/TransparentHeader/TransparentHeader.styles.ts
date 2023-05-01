import {StyleSheet} from 'react-native';
import {Spacing, Typography} from '../../Styles';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.5,
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
});
