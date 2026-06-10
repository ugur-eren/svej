import {Text as NativeText, TextStyle} from 'react-native';
import {useTheme} from '@/Hooks/Theming';
import {Typography} from '@/Styles';
import {TextProps} from './props';

const Text: React.FC<TextProps> = (props) => {
  const {
    children,
    color = 'text',
    weight = 'regular',
    align = 'auto',
    fontSize = 14,
    lineHeight,
    style,
    ...restProps
  } = props;

  const theme = useTheme();

  const textStyles: TextStyle = {
    fontSize,
    lineHeight,
    color: theme.colors[color],
    textAlign: align,

    ...Typography[weight],
  };

  return (
    <NativeText {...restProps} style={[textStyles, style]}>
      {children}
    </NativeText>
  );
};

export default Text;
