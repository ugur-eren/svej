import Color from 'color';
import {DefaultTheme as PaperLightTheme, MD3DarkTheme as PaperDarkTheme} from 'react-native-paper';
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
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
      secondaryContainer: LightThemeColors.colors.primary,

      onPrimary: LightThemeColors.colors.onPrimary,
      onBackground: LightThemeColors.colors.text,
      onSurface: LightThemeColors.colors.text,
      onSurfaceVariant: LightThemeColors.colors.text,

      // TODO: Give proper elevation colors
      elevation: {
        level0: LightThemeColors.colors.surface,
        level1: LightThemeColors.colors.backgroundSecondary,
        level2: LightThemeColors.colors.backgroundSecondary,
        level3: LightThemeColors.colors.backgroundSecondary,
        level4: LightThemeColors.colors.backgroundSecondary,
        level5: LightThemeColors.colors.backgroundSecondary,
      },
    },
  },

  navigation: {
    dark: false,
    colors: {
      ...NavigationLightTheme.colors,

      primary: LightThemeColors.colors.primary,
      background: LightThemeColors.colors.background,
      card: LightThemeColors.colors.backgroundSecondary,
      text: LightThemeColors.colors.text,
      border: LightThemeColors.colors.inputBorder,
      notification: LightThemeColors.colors.primary,
    },
  },
};

export const DarkTheme = {
  dark: true,
  colors: DarkThemeColors.colors,
  gradients: DarkThemeColors.gradients,

  paper: {
    ...PaperDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,

      primary: DarkThemeColors.colors.primary,
      surface: DarkThemeColors.colors.surface,
      surfaceVariant: Color(DarkThemeColors.colors.primary).alpha(0.16).toString(),
      error: DarkThemeColors.colors.error,
      background: DarkThemeColors.colors.background,

      onPrimary: DarkThemeColors.colors.onPrimary,
      onBackground: DarkThemeColors.colors.text,
      onSurface: DarkThemeColors.colors.text,
      onSurfaceVariant: DarkThemeColors.colors.text,

      // TODO: Give proper elevation colors
      elevation: {
        level0: DarkThemeColors.colors.surface,
        level1: DarkThemeColors.colors.backgroundSecondary,
        level2: DarkThemeColors.colors.backgroundSecondary,
        level3: DarkThemeColors.colors.backgroundSecondary,
        level4: DarkThemeColors.colors.backgroundSecondary,
        level5: DarkThemeColors.colors.backgroundSecondary,
      },
    },
  },

  navigation: {
    dark: true,
    colors: {
      ...NavigationDarkTheme.colors,

      primary: DarkThemeColors.colors.primary,
      background: DarkThemeColors.colors.background,
      card: DarkThemeColors.colors.backgroundSecondary,
      text: DarkThemeColors.colors.text,
      border: DarkThemeColors.colors.inputBorder,
      notification: DarkThemeColors.colors.primary,
    },
  },
};
