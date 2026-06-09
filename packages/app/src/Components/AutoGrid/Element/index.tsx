import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {AutoGridContext} from '../context';
import {AutoGridElementProps} from '../props';
import styles from '../styles';

const AutoGridElement: React.FC<AutoGridElementProps> = (props) => {
  const {children, style, ...restProps} = props;

  const itemSize = useContext(AutoGridContext);

  return (
    <View style={StyleSheet.compose([styles.element, {width: itemSize}], style)} {...restProps}>
      {children}
    </View>
  );
};

export default AutoGridElement;
