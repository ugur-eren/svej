import {Typography} from '../Styles';
import {ThemeType} from '../Hooks/Theming';

export type ColorNames = keyof ThemeType['colors'];

export type TypographyNames = keyof typeof Typography;
