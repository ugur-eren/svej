import {StyleSheet} from 'react-native';
import {Spacing} from '../../../Styles';

export default StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },

  pagination: {
    position: 'absolute',
    left: 0,
    bottom: Spacing.small,
    width: '100%',
    alignItems: 'center',
  },
});
