import {Typography} from '../Styles';
import {ThemeType} from '../Hooks/Theming';

export type ColorNames = keyof ThemeType['colors'];
export type GradientNames = keyof ThemeType['gradients'];

export type TypographyNames = keyof typeof Typography;
