import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {AutoGridContext} from './AutoGrid.context';
import {AutoGridElementProps} from './AutoGrid.props';
import styles from './AutoGrid.styles';

const Element: React.FC<AutoGridElementProps> = (props) => {
  const {children, style, ...restProps} = props;

  const itemSize = useContext(AutoGridContext);

  return (
    <View style={StyleSheet.compose([styles.element, {flexBasis: itemSize}], style)} {...restProps}>
      {children}
    </View>
  );
};

export default Element;
