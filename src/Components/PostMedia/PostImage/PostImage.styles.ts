import Color from 'color';
import {StyleSheet} from 'react-native';
import {Colors} from '../../../Styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color(Colors.CommonColors.black).alpha(0.25).toString(),
  },
});
