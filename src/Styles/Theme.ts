import Color from 'color';
import {DefaultTheme as PaperLightTheme} from 'react-native-paper';
import {LightThemeColors, DarkThemeColors} from './Colors';

export const LightTheme = {
  dark: false,
  colors: LightThemeColors.colors,
  gradients: LightThemeColors.gradients,
  paper: {
    ...PaperLightTheme,
    colors: {
      ...PaperLightTheme.colors,

      primary: LightThemeColors.colors.primary,
      surface: LightThemeColors.colors.surface,
      surfaceVariant: Color(LightThemeColors.colors.primary).alpha(0.16).toString(),
      error: LightThemeColors.colors.error,
      background: LightThemeColors.colors.background,

      onPrimary: LightThemeColors.colors.onPrimary,
      onBackground: LightThemeColors.colors.text,
      onSurface: LightThemeColors.colors.text,
      onSurfaceVariant: LightThemeColors.colors.text,
    },
  },
};

export const DarkTheme = {
  dark: true,
  colors: DarkThemeColors.colors,
  gradients: DarkThemeColors.gradients,
  paper: {
    ...PaperLightTheme,
    colors: {
      ...PaperLightTheme.colors,

      primary: DarkThemeColors.colors.primary,
      surface: DarkThemeColors.colors.surface,
      surfaceVariant: Color(DarkThemeColors.colors.primary).alpha(0.16).toString(),
      error: DarkThemeColors.colors.error,
      background: DarkThemeColors.colors.background,

      onPrimary: DarkThemeColors.colors.onPrimary,
      onBackground: DarkThemeColors.colors.text,
      onSurface: DarkThemeColors.colors.text,
      onSurfaceVariant: DarkThemeColors.colors.text,
    },
  },
};
