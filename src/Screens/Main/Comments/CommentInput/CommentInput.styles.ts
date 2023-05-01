import {ThemedStyleSheet} from '../../../../Utils/ThemedStyleSheet';
import {Spacing, Typography} from '../../../../Styles';

export default ThemedStyleSheet((theme) => ({
  writeCommentContainer: {
    backgroundColor: theme.colors.backgroundSecondary,

    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  writeCommentContent: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundSecondary,
  },
  writeCommentInput: {
    flex: 1,
    height: 49,
    paddingHorizontal: Spacing.small,
    marginLeft: Spacing.xxsmall,
    color: theme.colors.text,

    ...Typography.regular,
  },
}));
