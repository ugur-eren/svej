import Color from 'color';
import {StyleSheet} from 'react-native';
import {ThemedStyleSheet} from '../../../Utils/ThemedStyleSheet';
import {Spacing} from '../../../Styles';

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

  divider: {
    width: '100%',
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

  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.medium,
  },
  imageContainer: {
    width: '100%',
    maxWidth: '50%',
    borderRadius: 20,
  },
  imageSurface: {
    flex: 1,
    borderRadius: 20,
  },
  imageContainerInner: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageFix: {
    paddingBottom: '100%',
  },
  imageInner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageTouchableFix: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },

  submitButton: {
    backgroundColor: theme.colors.backgroundSecondary,
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
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxlarge,
    aspectRatio: 1,
  },
  selectorOptionItem: {
    marginTop: 10,
  },
}));
