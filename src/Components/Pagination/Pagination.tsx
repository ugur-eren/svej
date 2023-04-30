import {memo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {PaginationProps} from './Pagination.props';
import getStyles from './Pagination.styles';
import {useTheme} from '../../Hooks';

const Pagination: React.FC<PaginationProps> = (props) => {
  const {count, activeIndex, onDotPress, containerStyle} = props;

  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={StyleSheet.compose(styles.container, containerStyle)}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <TouchableOpacity style={styles.dotContainer} onPress={() => onDotPress?.(index)}>
            <View
              // eslint-disable-next-line react/no-array-index-key
              key={index.toString()}
              style={[styles.dot, activeIndex === index ? styles.activeDot : styles.inactiveDot]}
            />
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default memo(Pagination);
