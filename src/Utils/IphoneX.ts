/* eslint import/prefer-default-export: "off" */

import {Dimensions, Platform} from 'react-native';

const dimensions = Dimensions.get('window');

export const isIphoneX =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTV &&
  (dimensions.height === 780 ||
    dimensions.width === 780 ||
    dimensions.height === 812 ||
    dimensions.width === 812 ||
    dimensions.height === 844 ||
    dimensions.width === 844 ||
    dimensions.height === 896 ||
    dimensions.width === 896 ||
    dimensions.height === 926 ||
    dimensions.width === 926);
