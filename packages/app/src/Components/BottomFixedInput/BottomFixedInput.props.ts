import {TextInputProps} from 'react-native';
import {SafeAreaViewProps} from 'react-native-safe-area-context';

export type BottomFixedInputProps = TextInputProps & {
  containerProps?: SafeAreaViewProps;
  left?: React.ReactNode;
  right?: React.ReactNode;
};
