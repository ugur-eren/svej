import {Platform, Dimensions, StatusBar} from 'react-native';
import memoizeOne from 'memoize-one';

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

export const deg2rad = (deg: number): number => (deg * Math.PI) / 180;

export const rad2deg = (rad: number): number => (rad * 180) / Math.PI;

/**
 * Calculates the container width of a rotated rectangle.
 *
 * @param width Width of the rotated rectangle.
 * @param height Height of the rotated rectangle.
 * @param angle Angle of rotation in degrees.
 * @returns Width of the container rectangle
 */
export const CalculateRotatedWidth = memoizeOne(
  (width: number, height: number, angle: number): number => {
    const radian = deg2rad(angle);

    return Math.sin(radian) * height + Math.cos(radian) * width;
  },
);

/**
 * Using the sizes returned by this function will center the image no matter what the dimensions of device or image is.
 *
 * @param imageWidth Real width of the image that should be centered
 * @param imageHeight Real height of the image that should be centered
 * @param screenWidth Width of the devie screen
 * @param screenHeigt Height of the device screen. (Don't forget to substract the Status Bar height for Android)
 * @returns `{centered imageWidth, centered imageHeight}`
 */
export const CalculateImageSizeBounds = memoizeOne(
  (
    imageWidth: number,
    imageHeight: number,
    screenWidth: number,
    screenHeight: number,
  ): {
    imageWidth: number;
    imageHeight: number;
  } => {
    const imageWidthRatio = imageWidth / imageHeight;
    const imageHeightRatio = imageHeight / imageWidth;
    const screenWidthRatio = screenWidth / screenHeight;
    const screenHeightRatio = screenHeight / screenWidth;

    const isWide = imageWidth > imageHeight && imageWidthRatio > screenWidthRatio;
    const isTall = imageHeight > imageWidth && imageHeightRatio > screenHeightRatio;

    return {
      imageWidth: isWide ? screenWidth : screenHeight * imageWidthRatio,
      imageHeight: isTall ? screenHeight : screenWidth * imageHeightRatio,
    };
  },
);

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
