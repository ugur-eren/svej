import {Platform, Dimensions, StatusBar} from 'react-native';

export const IsIOS = Platform.OS === 'ios';
export const IsAndroid = Platform.OS === 'android';

export const MajorOSVersion = IsIOS ? parseInt(Platform.Version.toString(), 10) : Platform.Version;

export const getFontScale = (): number => Dimensions.get('window').fontScale;

export const StatusBarHeight = IsIOS ? 0 : StatusBar.currentHeight || 0;

/**
 * A custom keyboardType that will only have numeric values in the keyboard
 * for both Android and IOS platforms.
 */
export const OnlyNumericPad = IsIOS ? 'number-pad' : 'numeric';

/**
 * Replaces the given `parts` in `language` string
 *
 * Given string must include a part (`%part_key%`)
 *
 * #### Example:
 * String: `Today is %date%, send email to %email%`
 *
 * `parseLanguageParts(language.some_value, {date: Date.now(), email: 'mail[at]example.com'});`
 *
 * @param language Language string to be parsed.
 * @param parts Parts to be replaced with.
 * @returns **string** - Parsed language string
 */
export const parseLanguageParts = (
  language: string,
  parts: Record<string, string | number>,
): string => {
  return Object.keys(parts).reduce((current, key) => {
    let value: string | number = parts[key];
    if (typeof value === 'number') value = value.toString();

    const regexp = new RegExp(`%${key}%`, 'g');

    return current.replace(regexp, value);
  }, language);
};
