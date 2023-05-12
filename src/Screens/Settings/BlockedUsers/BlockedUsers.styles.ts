import {ThemedStyleSheet} from '../../../Utils/ThemedStyleSheet';
import {Spacing} from '../../../Styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
  },
  flatList: {
    padding: Spacing.pagePadding,
  },
}));
