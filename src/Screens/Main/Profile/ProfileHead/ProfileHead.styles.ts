import {StyleSheet} from 'react-native';
import {ThemedStyleSheet} from '../../../../Utils/ThemedStyleSheet';
import {IsAndroid} from '../../../../Utils/Helpers';
import {Spacing} from '../../../../Styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    position: 'relative',
  },

  backgroundContainer: {
    position: 'relative',
    height: IsAndroid ? 200 : 235,
  },

  topInfoContainer: {
    height: 80,
    paddingLeft: Spacing.small,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    top: -25,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
    position: 'relative',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  userInfo: {
    paddingHorizontal: Spacing.xsmall,
    flex: 1,
  },
  userActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  bio: {
    paddingHorizontal: Spacing.xsmall,
    paddingBottom: Spacing.xsmall,
    backgroundColor: theme.colors.surface,
  },

  userTagsContainer: {
    backgroundColor: theme.colors.surface,
    marginTop: StyleSheet.hairlineWidth,
    padding: Spacing.xsmall,
  },
  userTag: {
    flexDirection: 'row',
    marginBottom: Spacing.xxxsmall,
    alignItems: 'center',
  },
  userTagIcon: {
    marginRight: Spacing.xsmall,
  },

  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xsmall,
    marginVertical: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.surface,
  },
  postsCount: {
    flex: 1,
    alignItems: 'center',
  },
  centerDivider: {
    backgroundColor: theme.colors.background,
    width: StyleSheet.hairlineWidth,
    height: '100%',
  },
  centerTouchable: {
    alignItems: 'center',
    flex: 1,
  },
}));
