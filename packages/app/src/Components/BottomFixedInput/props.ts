import {TextInputProps, ViewProps} from 'react-native';

export type BottomFixedInputProps = TextInputProps & {
  containerProps?: ViewProps;
  left?: React.ReactNode;
  right?: React.ReactNode;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
};
