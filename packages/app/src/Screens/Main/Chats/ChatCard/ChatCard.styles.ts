import {ThemedStyleSheet} from '../../../../Utils/ThemedStyleSheet';
import {Spacing} from '../../../../Styles';

export default ThemedStyleSheet((theme) => ({
  userContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xsmall,
    marginVertical: Spacing.xsmall,
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    marginHorizontal: Spacing.xsmall,
  },
  notSeen: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    backgroundColor: theme.colors.primary,
    width: Spacing.small,
    height: Spacing.small,
    borderRadius: Spacing.small,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
