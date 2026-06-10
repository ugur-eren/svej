import {Children, useCallback, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {useDimensions} from '@/Hooks';
import AutoGridElement from './Element';
import {AutoGridContext} from './context';
import {AutoGridProps, AutoGridSubComponents} from './props';
import styles from './styles';

const AutoGrid: React.FC<AutoGridProps> & AutoGridSubComponents = (props) => {
  const {itemSize, gap, style, children, ...restProps} = props;

  const {width: windowWidth} = useDimensions();
  const [containerWidth, setContainerWidth] = useState(windowWidth);

  const itemsPerRow = Math.max(Math.round(containerWidth / itemSize), 1);
  const totalGaps = itemsPerRow > 1 ? itemsPerRow - 1 : 0;
  const calculatedItemSize = Math.floor((containerWidth - totalGaps * gap) / itemsPerRow);

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

        {childrenCount % itemsPerRow === 0
          ? null
          : Array(itemsPerRow - (childrenCount % itemsPerRow))
              .fill(null)
              // eslint-disable-next-line react/no-array-index-key
              .map((_, i) => <AutoGridElement key={i.toString()} />)}
      </View>
    </AutoGridContext.Provider>
  );
};

AutoGrid.Element = AutoGridElement;

export default AutoGrid;
