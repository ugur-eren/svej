import {StyleSheet} from 'react-native';
import {Spacing, Typography} from '../../Styles';

export default StyleSheet.create({
  title: {
    fontSize: 18,
    lineHeight: 22,
    ...Typography.semiBold,
  },
  leftPlus: {
    left: Spacing.xxsmall,
  },
});
