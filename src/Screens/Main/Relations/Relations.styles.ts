import {ThemedStyleSheet} from '../../../Utils/ThemedStyleSheet';
import {Spacing} from '../../../Styles';

export default ThemedStyleSheet((theme) => ({
  item: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.xsmall,
  },
}));
