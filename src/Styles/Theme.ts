import Color from 'color';
import {DefaultTheme as PaperLightTheme, MD3DarkTheme as PaperDarkTheme} from 'react-native-paper';
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {LightThemeColors, DarkThemeColors} from './Colors';

const generateTheme = (dark: boolean, theme: typeof LightThemeColors) => {
  const PaperTheme = dark ? PaperDarkTheme : PaperLightTheme;
  const NavigationTheme = dark ? NavigationDarkTheme : NavigationLightTheme;

  return {
    dark,
    colors: theme.colors,
    gradients: theme.gradients,

    paper: {
      ...PaperTheme,
      dark,

      colors: {
        ...PaperTheme.colors,

        primary: theme.colors.primary,
        surface: theme.colors.surface,
        surfaceVariant: Color(theme.colors.primary).alpha(0.16).toString(),
        error: theme.colors.error,
        background: theme.colors.background,
        secondaryContainer: theme.colors.primary,

        onPrimary: theme.colors.onPrimary,
        onBackground: theme.colors.text,
        onSurface: theme.colors.text,
        onSurfaceVariant: theme.colors.text,

        // TODO: Give proper elevation colors
        elevation: {
          level0: theme.colors.surface,
          level1: theme.colors.elevated,
          level2: theme.colors.elevated,
          level3: theme.colors.elevated,
          level4: theme.colors.elevated,
          level5: theme.colors.elevated,
        },
      },
    } satisfies typeof PaperTheme,

    navigation: {
      dark,
      colors: {
        ...NavigationTheme.colors,

        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.elevated,
        text: theme.colors.text,
        border: theme.colors.inputBorder,
        notification: theme.colors.primary,
      },
    } satisfies typeof NavigationTheme,
  };
};

export const LightTheme = generateTheme(false, LightThemeColors);

export const DarkTheme = generateTheme(true, DarkThemeColors);
