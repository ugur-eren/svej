import {StyleSheet} from 'react-native';
import memoizeOne from 'memoize-one';
import {ThemeType} from '../Hooks/Theming';

/**
 * Custom StyleSheet creator that takes `theme` context. It passes the theme type automatically
 * @param getThemedStyleSheet Function to handle memoization and theming
 * @returns Memoized and Themed StyleSheet
 */
export const ThemedStyleSheet = <T extends StyleSheet.NamedStyles<T>, A extends unknown[]>(
  getThemedStyleSheet: (theme: ThemeType, ...args: A) => T | StyleSheet.NamedStyles<T>,
): ((theme: ThemeType, ...args: A) => T) => {
  return memoizeOne((theme, ...args: A) => {
    return StyleSheet.create(getThemedStyleSheet(theme, ...args));
  });
};
