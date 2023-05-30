import {forwardRef, useCallback, useRef, useState} from 'react';
import {FlatList, FlatListProps, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Post} from '../../Components';
import {VisibilityContext} from '../../Hooks';
import {IsAndroid} from '../../Utils/Helpers';
import {PostListProps} from './PostList.props';
import styles from './PostList.styles';

const ItemSeparatorComponent = () => <View style={styles.separator} />;

const PostList = forwardRef<FlatList, PostListProps>((props, ref) => {
  const {...flatlistProps} = props;

  const lastViewedItem = useRef<number | null>(null);
  const [visibleItem, setVisibleItem] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (lastViewedItem.current !== null) {
        setVisibleItem(lastViewedItem.current);
      }

      return () => {
        setVisibleItem(null);
      };
    }, [lastViewedItem]),
  );

  const viewabilityConfigPairs = useRef<FlatListProps<never>['viewabilityConfigCallbackPairs']>([
    {
      viewabilityConfig: {viewAreaCoveragePercentThreshold: 60},
      onViewableItemsChanged: ({viewableItems}) => {
        if (viewableItems.length > 0) {
          lastViewedItem.current = viewableItems[0].index;
          setVisibleItem(viewableItems[0].index);
        } else {
          lastViewedItem.current = null;
          setVisibleItem(null);
        }
      },
    },
  ]);

  return (
    <FlatList
      ref={ref}
      ItemSeparatorComponent={ItemSeparatorComponent}
      removeClippedSubviews={IsAndroid}
      viewabilityConfigCallbackPairs={viewabilityConfigPairs.current}
      data={['1', '2', '3', '4']}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({index}) => (
        <VisibilityContext.Provider value={visibleItem === index}>
          <Post />
        </VisibilityContext.Provider>
      )}
      {...flatlistProps}
    />
  );
});

export default PostList;
