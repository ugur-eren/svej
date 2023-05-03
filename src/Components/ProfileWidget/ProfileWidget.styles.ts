import {StyleSheet} from 'react-native';
import {Spacing} from '../../Styles';

export default StyleSheet.create({
  container: {
    padding: Spacing.xsmall,
    flexDirection: 'row',
  },
  touchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 60,
    overflow: 'hidden',
    marginRight: Spacing.medium,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  username: {
    marginBottom: 2,
  },
});
