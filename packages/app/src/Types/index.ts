import Feather from '@expo/vector-icons/Feather';
import {Typography} from '../Styles';
import {ThemeType} from '../Hooks/Theming';

export * from './NavigationTypes';
export * from './Generics';

export type ColorNames = keyof ThemeType['colors'];
export type GradientNames = keyof ThemeType['gradients'];

export type TypographyNames = keyof typeof Typography;

export type FeatherIconNames = React.ComponentPropsWithoutRef<typeof Feather>['name'];
