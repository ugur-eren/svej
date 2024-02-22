import {forwardRef, useCallback, useRef, useState} from 'react';
import {FlatList, FlatListProps, View} from 'react-native';
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';
import {Post} from '../../Components';
import {VisibilityContext, useForwardedRef, useQuery} from '../../Hooks';
import {PostApi} from '../../Api';
import {IsAndroid} from '../../Utils/Helpers';
import {PostListProps} from './PostList.props';
import styles from './PostList.styles';

const ItemSeparatorComponent = () => <View style={styles.separator} />;

const PostList = forwardRef<FlatList, PostListProps>((props, ref) => {
  const {type, userId, ...flatlistProps} = props;

  const forwardedRef = useForwardedRef(ref);

  useScrollToTop(forwardedRef);

  const posts = useQuery({
    queryKey: ['posts', type, userId],
    queryFn: () => {
      if (type === 'explore') {
        return PostApi.getExplore();
      }

      if (type === 'profile' && userId) {
        return PostApi.getByUserId(userId);
      }

      return PostApi.getAll();
    },
  });

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

  // TODO: add loading indicator
  if (!posts.data) return null;

  return (
    <FlatList
      ref={forwardedRef}
      ItemSeparatorComponent={ItemSeparatorComponent}
      removeClippedSubviews={IsAndroid}
      viewabilityConfigCallbackPairs={viewabilityConfigPairs.current}
      data={posts.data}
      keyExtractor={(item) => item.id}
      renderItem={({item, index}) => (
        <VisibilityContext.Provider value={visibleItem === index}>
          <Post post={item} />
        </VisibilityContext.Provider>
      )}
      {...flatlistProps}
    />
  );
});

export default PostList;
