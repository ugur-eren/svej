import {StyleSheet} from 'react-native';
import memoizeOne from 'memoize-one';

/**
 * Custom StyleSheet creator that takes args of any type and memoizes the output.
 * @param getCustomStyleSheet Function to handle memoization
 * @returns Memoized StyleSheet
 */
export const CustomStyleSheet = <T extends StyleSheet.NamedStyles<T>, A extends unknown[]>(
  getCustomStyleSheet: (...args: A) => T | StyleSheet.NamedStyles<T>,
): ((...args: A) => T) => {
  return memoizeOne((...args: A) => {
    return StyleSheet.create(getCustomStyleSheet(...args));
  });
};
