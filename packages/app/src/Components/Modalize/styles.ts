import {ThemedStyleSheet, Spacing} from '@/Styles';
import {IsIOS} from '@/Utils/Helpers';

export default ThemedStyleSheet((theme) => ({
  modal: {
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: Spacing.small,
    paddingTop: IsIOS ? Spacing.large : Spacing.xsmall,
  },
}));
