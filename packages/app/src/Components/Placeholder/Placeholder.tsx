import {memo} from 'react';
import {
  PlaceholderLine as RNPlaceholderLine,
  PlaceholderMedia as RNPlaceholderMedia,
} from 'rn-placeholder';
import {useTheme} from '../../Hooks';

export const PlaceholderLine: typeof RNPlaceholderLine = memo((props) => {
  const theme = useTheme();
  return <RNPlaceholderLine color={theme.colors.placeholder} {...props} />;
});

export const PlaceholderMedia: typeof RNPlaceholderMedia = memo((props) => {
  const theme = useTheme();
  return <RNPlaceholderMedia color={theme.colors.placeholder} {...props} />;
});
