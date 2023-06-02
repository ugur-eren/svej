import {StyleSheet} from 'react-native';
import Color from 'color';
import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';

export default ThemedStyleSheet((theme) => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Color(theme.colors.background).alpha(0.5).toString(),
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
