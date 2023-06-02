import {StyleSheet} from 'react-native';
import {Spacing} from '../../Styles';

export default StyleSheet.create({
  container: {
    width: '100%',
  },
  background: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  touchable: {
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.medium,
  },
  text: {
    left: -20,
  },
  spinner: {
    marginRight: 20,
    left: -20,
  },
});
