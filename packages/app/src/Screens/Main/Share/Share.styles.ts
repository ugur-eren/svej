import Color from 'color';
import {StyleSheet} from 'react-native';
import {ThemedStyleSheet} from '../../../Utils/ThemedStyleSheet';
import {Spacing} from '../../../Styles';
import {CalculateElevation} from '../../../Utils/Elevation';

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

  medias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.medium,
  },
  mediaContainer: {
    flexGrow: 1,
    flexBasis: '40%', // not 50% to avoid wrapping, minding the gap
    borderRadius: 20,
  },
  mediaContainerElevated: {
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
    ...StyleSheet.absoluteFillObject,
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

  selectorContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color(theme.colors.surface).alpha(0.5).toString(),
  },
  selectorInner: {
    flexDirection: 'row',
    gap: Spacing.xxsmall,
  },
  selectorOption: {
    backgroundColor: theme.colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxlarge,
    aspectRatio: 1,
  },
  selectorOptionItem: {
    marginTop: 10,
  },
}));
