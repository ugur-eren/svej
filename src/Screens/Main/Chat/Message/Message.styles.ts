import {ThemedStyleSheet} from '../../../../Utils/ThemedStyleSheet';
import {Spacing} from '../../../../Styles';

export default ThemedStyleSheet((theme) => ({
  sentContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xsmall,
  },
  sent: {
    flexDirection: 'row',
    maxWidth: '60%',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  sentText: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: Spacing.xxxsmall,
    paddingHorizontal: Spacing.xsmall,
    borderRadius: 10,
    borderBottomRightRadius: 0,
  },
  sendingIcon: {
    marginLeft: Spacing.xsmall,
  },

  receivedContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Spacing.xsmall,
  },
  receivedAvatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginRight: Spacing.xsmall,
  },
  received: {
    flexDirection: 'row',
    maxWidth: '60%',
    marginVertical: Spacing.xxsmall,
  },
  receivedText: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: Spacing.xxxsmall,
    paddingHorizontal: Spacing.xsmall,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
  },
}));
