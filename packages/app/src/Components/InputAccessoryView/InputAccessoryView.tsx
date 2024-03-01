import {
  View,
  InputAccessoryView as RNInputAccessoryView,
  InputAccessoryViewProps,
} from 'react-native';
import {IsAndroid} from '../../Utils/Helpers';

/**
 * Wrapper around RN's InputAccessoryView component.
 * Why? Because on Android, InputAccessoryView is not supported.
 * So we need to render the children in a View instead.
 */
const InputAccessoryView: React.FC<InputAccessoryViewProps> = ({children, ...props}) => {
  if (IsAndroid) return <View {...props}>{children}</View>;

  return <RNInputAccessoryView {...props}>{children}</RNInputAccessoryView>;
};

export default InputAccessoryView;
