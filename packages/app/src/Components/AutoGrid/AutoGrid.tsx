import {Children, useCallback, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View, useWindowDimensions} from 'react-native';
import Element from './AutoGrid.Element';
import {AutoGridContext} from './AutoGrid.context';
import {AutoGridProps, AutoGridSubComponents} from './AutoGrid.props';
import styles from './AutoGrid.styles';

const AutoGrid: React.FC<AutoGridProps> & AutoGridSubComponents = (props) => {
  const {itemSize, gap, style, children, ...restProps} = props;

  const {width: windowWidth} = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(windowWidth);

  const itemsPerRow = Math.round(containerWidth / itemSize);
  const totalGaps = itemsPerRow > 1 ? itemsPerRow - 1 : 0;
  const calculatedItemSize = (containerWidth - totalGaps * gap) / itemsPerRow;

  const childrenCount = Children.count(children);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <AutoGridContext.Provider value={calculatedItemSize}>
      <View
        onLayout={onLayout}
        style={StyleSheet.compose([styles.container, {gap}], style)}
        {...restProps}
      >
        {children}

        {childrenCount % itemsPerRow !== 0 ? <Element /> : null}
      </View>
    </AutoGridContext.Provider>
  );
};

AutoGrid.Element = Element;

export default AutoGrid;
