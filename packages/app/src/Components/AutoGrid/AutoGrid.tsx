import {Children, useCallback, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {useDimensions} from '../../Hooks';
import Element from './AutoGrid.Element';
import {AutoGridContext} from './AutoGrid.context';
import {AutoGridProps, AutoGridSubComponents} from './AutoGrid.props';
import styles from './AutoGrid.styles';

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
              .map((_, i) => <Element key={i.toString()} />)}
      </View>
    </AutoGridContext.Provider>
  );
};

AutoGrid.Element = Element;

export default AutoGrid;
