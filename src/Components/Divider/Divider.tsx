import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../Hooks';
import {DividerProps} from './Divider.props';
import getStyles from './Divider.styles';

const Divider: React.FC<DividerProps> = (props) => {
  const {
    color = 'background',
    direction = 'horizontal',
    thickness = StyleSheet.hairlineWidth,
    style: styleProp,
  } = props;

  const theme = useTheme();

  const styles = getStyles(theme, color, thickness);

  return <View style={StyleSheet.compose([styles.base, styles[direction]], styleProp)} />;
};

export default Divider;
