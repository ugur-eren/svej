import {forwardRef, useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, FlatListProps, RefreshControl, View} from 'react-native';
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {Post} from '../../Components';
import {VisibilityContext, useForwardedRef, useInfiniteQuery} from '../../Hooks';
import {PostApi} from '../../Api';
import {PostsActions, useAppDispatch} from '../../Redux';
import {IsAndroid} from '../../Utils/Helpers';
import {PostListProps} from './PostList.props';
import styles from './PostList.styles';

const ItemSeparatorComponent = () => <View style={styles.separator} />;

const PostList = forwardRef<FlatList, PostListProps>((props, ref) => {
  const {type, userId, ...flatlistProps} = props;

  const forwardedRef = useForwardedRef(ref);

  useScrollToTop(forwardedRef);

  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const posts = useInfiniteQuery({
    initialPageParam: Date.now().toString(),
    queryKey: ['posts', type, userId],
    getNextPageParam: (lastPage: any, allPages, lastPageParam) => {
      if (!lastPage?.length) return undefined;

      const pageParam = lastPage[lastPage.length - 1].createdAt;

      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam;
    },
    queryFn: async ({pageParam}) => {
      if (type === 'explore') {
        return PostApi.getExplore(pageParam);
      }

      if (type === 'profile') {
        if (!userId) return [];

        return PostApi.getByUserId(userId, pageParam);
      }

      return [];
    },
  });

  const lastViewedItem = useRef<number | null>(null);
  const [visibleItem, setVisibleItem] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (posts.status === 'success' && posts.data && Array.isArray(posts.data)) {
      dispatch(PostsActions.addPosts(posts.data));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.status === 'success']);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      queryClient.invalidateQueries({queryKey: ['post']});
      await posts.refetch();
    } catch (error) {
      //
    } finally {
      setRefreshing(false);
    }
  }, [posts, queryClient]);

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
      onEndReachedThreshold={0.2}
      onEndReached={() => posts.fetchNextPage()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      data={posts.data.pages.flat() as any[]}
      keyExtractor={(item) => item.id}
      renderItem={({item, index}) => (
        <VisibilityContext.Provider value={visibleItem === index}>
          <Post postId={item.id} />
        </VisibilityContext.Provider>
      )}
      {...flatlistProps}
    />
  );
});

export default PostList;
