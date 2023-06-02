import Color from 'color';
import {ThemedStyleSheet} from '../../../Utils/ThemedStyleSheet';

export default ThemedStyleSheet((theme) => ({
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color(theme.colors.surface).alpha(0.75).toString(),
  },

  errorTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
  },

  mutedContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  muted: {
    textShadowColor: theme.colors.black,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
}));
