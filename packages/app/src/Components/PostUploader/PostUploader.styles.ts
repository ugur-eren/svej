import Color from 'color';
import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing} from '../../Styles';
import {IsAndroid, IsIOS} from '../../Utils/Helpers';

export default ThemedStyleSheet((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: Color(theme.colors.primary).alpha(0.1).string(),
  },
  safeArea: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    top: IsIOS ? -6 : 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: IsAndroid ? 2 : Spacing.none,
    paddingHorizontal: Spacing.small,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.colors.primary,
  },
}));
