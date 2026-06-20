import {Spacing, ThemedStyleSheet} from '@/Styles';
import {CalculateElevation} from '@/Utils/Elevation';

export default ThemedStyleSheet((theme) => ({
  content: {
    backgroundColor: theme.colors.surface,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.pagePadding,
    marginBottom: Spacing.normal,
  },
  noBottomMargin: {
    marginBottom: 0,
  },

  topContainer: {
    width: '100%',
    paddingVertical: Spacing.xsmall,
    alignItems: 'center',
  },
  topInner: {
    flexDirection: 'row',
    marginBottom: Spacing.xsmall,
    width: '100%',
  },
  topIcon: {
    marginRight: Spacing.medium,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  mediaContainer: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: theme.colors.elevated,
    ...CalculateElevation(2),
  },
  mediaContent: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  media: {
    flex: 1,
  },
  mediaRemoveButton: {
    position: 'absolute',
    backgroundColor: theme.colors.elevated,
    right: -6,
    top: -6,
    borderRadius: 0,
    borderBottomLeftRadius: 20,
  },

  mediaAddButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButton: {
    backgroundColor: theme.colors.elevated,
  },
  submitButtonContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.medium,
  },
  submitIcon: {
    marginRight: Spacing.xsmall,
  },
}));
