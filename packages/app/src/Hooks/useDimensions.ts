import {Platform, useWindowDimensions} from 'react-native';
import {WEB_MAX_WIDTH} from '../Utils/Constants';

export const useDimensions = () => {
  const dimensions = useWindowDimensions();

  if (Platform.OS === 'web') dimensions.width = WEB_MAX_WIDTH;

  return dimensions;
};
