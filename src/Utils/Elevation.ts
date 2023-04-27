import {ViewStyle} from 'react-native';

// Scraped from https://github.com/ethercreative/react-native-shadow-generator

/**
 * A function to automatically calulate elevation and shadow values for both Android and IOS platforms.
 * Because Lazy
 * @param elevation Android elevation value to calculate outputs
 * @param color IOS Shadow color
 * @returns Elevation and shadow values for both Android and IOS platforms
 */
const CalculateElevation = (elevation: number, color = '#000'): ViewStyle => {
  const depth = elevation - 1;

  const penumbra = Penumbras[depth];
  const penumbraDetail = {
    height: penumbra[0],
    blur: penumbra[1],
  };

  const height = penumbraDetail.height === 1 ? 1 : Math.floor(penumbraDetail.height * 0.5);
  const opacity = interpolate(depth, 1, 24, 0.2, 0.6).toFixed(2);
  const radius = interpolate(penumbraDetail.blur, 1, 38, 1, 16).toFixed(2);

  return {
    shadowColor: color,
    shadowOffset: {
      width: 0,
      height,
    },
    shadowOpacity: parseFloat(opacity),
    shadowRadius: parseFloat(radius),

    elevation,
  };
};

const interpolate = (i: number, a: number, b: number, a2: number, b2: number): number => {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
};

const Penumbras: [number, number][] = [
  [1, 1],
  [2, 2],
  [3, 4],
  [4, 5],
  [5, 8],
  [6, 10],
  [7, 10],
  [8, 10],
  [9, 12],
  [10, 14],
  [11, 15],
  [12, 17],
  [13, 19],
  [14, 21],
  [15, 22],
  [16, 24],
  [17, 26],
  [18, 28],
  [19, 29],
  [20, 31],
  [21, 33],
  [22, 35],
  [23, 36],
  [24, 38],
];

export {CalculateElevation, Penumbras};
