import {Spacing} from '../../Styles';
import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';

export default ThemedStyleSheet((theme, small: boolean) => ({
  container: {
    width: '100%',
    flexDirection: 'row',
    padding: Spacing.small,
    alignItems: 'center',
  },

  imageContainer: {
    width: small ? 35 : 50,
    height: small ? 35 : 50,
  },
  image: {
    width: small ? 35 : 50,
    height: small ? 35 : 50,
    borderRadius: 99,
  },

  contentContainer: {
    flex: 1,
    marginLeft: small ? 0 : Spacing.small,
    flexDirection: 'row',
  },
  content: {
    marginHorizontal: Spacing.small,
    justifyContent: 'center',
  },

  username: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTag: {
    marginLeft: Spacing.xxsmall,
  },

  timer: {
    marginTop: Spacing.xxxsmall,
  },
}));
