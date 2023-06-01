import {TextProps as RNTextProps, TextStyle} from 'react-native';
import {ColorNames, TypographyNames} from '../../Types';

export interface TextProps extends RNTextProps {
  color?: ColorNames;
  weight?: TypographyNames;
  fontSize?: number;
  lineHeight?: number;
  align?: TextStyle['textAlign'];
}
