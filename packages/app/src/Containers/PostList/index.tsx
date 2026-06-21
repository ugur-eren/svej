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
    queryKey: type === 'explore' ? ['posts', 'explore'] : ['posts', 'profile', userId],
    queryFn: async ({pageParam}) => {
      let data;
      if (type === 'explore') {
        data = await FeedApi.getExplore(pageParam);
      }

      if (type === 'profile' && userId) {
        data = await UsersApi.getPosts(userId, pageParam);
      }

      if (data?.data?.posts && Array.isArray(data.data.posts)) {
        for (const post of data.data.posts) {
          queryClient.setQueryData(['post', post.id], post);
        }
      }

      return data;
    },
    select: (data) => {
      return data.pages
        .map((page) => page?.posts)
        .filter((page): page is NonNullable<typeof page> => !!page)
        .flat();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextPageParam = lastPage?.nextCursor;
      if (nextPageParam && nextPageParam !== lastPageParam) {
        return nextPageParam;
      }
      return undefined;
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
      await posts.refetch();
    } finally {
      setRefreshing(false);
    }
  }, [posts]);

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
      data={posts.data}
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
