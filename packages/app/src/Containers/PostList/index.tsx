import {forwardRef, useCallback, useRef, useState} from 'react';
import {FlatList, FlatListProps, RefreshControl, View} from 'react-native';
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {Placeholders, Post} from '@/Components';
import {VisibilityContext, useForwardedRef, useInfiniteQuery} from '@/Hooks';
import {FeedApi, UsersApi} from '@/Api';
import {IsAndroid} from '@/Utils/Helpers';
import {PostListProps} from './props';
import styles from './styles';

const ItemSeparatorComponent = () => <View style={styles.separator} />;

const PostList = forwardRef<FlatList, PostListProps>((props, ref) => {
  const {type, userId, ...flatlistProps} = props;

  const forwardedRef = useForwardedRef(ref);

  useScrollToTop(forwardedRef);

  const queryClient = useQueryClient();

  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  const posts = useInfiniteQuery({
    initialPageParam: Date.now().toString(),
    queryKey: ['posts', type, userId],
    queryFn: async ({pageParam}) => {
      let data;
      if (type === 'explore') {
        // TODO: pagination
        data = await FeedApi.getExplore();
      }

      if (type === 'profile') {
        if (!userId) return [];

        data = await UsersApi.getPosts(userId);
      }

      if (data && Array.isArray(data.data)) {
        for (const post of data.data) {
          queryClient.setQueryData(['post', post.id], post);
        }
      }

      return data;
    },
    getNextPageParam: (lastPage: any, allPages, lastPageParam) => {
      return undefined;
      /* if (!lastPage?.length) return undefined;

      const pageParam = lastPage[lastPage.length - 1].createdAt;

      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam; */
    },
  });

  const lastViewedItem = useRef<number | null>(null);
  const [visibleItem, setVisibleItem] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  if (posts.isLoading || !posts.data) {
    return (
      <>
        {flatlistProps.ListHeaderComponent}
        <Placeholders.PostList />
        {flatlistProps.ListFooterComponent}
      </>
    );
  }

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
