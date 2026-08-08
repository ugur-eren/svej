import {Zod} from '@svej/common';
import {useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {PageContainer} from '@/Containers';
import {Header, Divider, Placeholders} from '@/Components';
import {useInfiniteQuery, useLanguage, useMutation, useShowToast} from '@/Hooks';
import {PostsApi} from '@/Api';
import {GlobalStyles} from '@/Styles';
import {CommentsScreenProps} from '@/Types';
import Comment from './Comment';
import CommentInput from './CommentInput';

const Comments: React.FC<CommentsScreenProps> = ({route}) => {
  const {postId} = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const language = useLanguage();
  const showToast = useShowToast();

  const queryClient = useQueryClient();

  const comments = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({pageParam}) => PostsApi.getComments(postId, pageParam),
    select: (data) => data.pages.map((page) => page.comments).flat(),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextPageParam = lastPage?.nextCursor;
      if (nextPageParam && nextPageParam !== lastPageParam) {
        return nextPageParam;
      }
      return undefined;
    },
  });

  const sendComment = useMutation({
    mutationKey: ['comment-create', postId],
    mutationFn: (comment: string) => PostsApi.createComment(postId, {text: comment}),
  });

  const onCommentSend = async (comment: string) => {
    if (!comment || !comment.trim()) return;

    const parsed = Zod.Comment.Create.safeParse({postId, text: comment});
    if (!parsed.success) {
      showToast({
        title: language.errors.ERROR,
        message: language.errors.COMMENT_INVALID,
        type: 'warning',
      });
      return;
    }

    await sendComment.mutateAsync(comment, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['comments', postId]});
      },
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await comments.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageContainer>
      <Header title={language.comments.title} />

      {comments.isLoading || !comments.data ? (
        <Placeholders.CommentList />
      ) : (
        <>
          <FlatList
            data={comments.data}
            onEndReachedThreshold={0.2}
            onEndReached={() => comments.fetchNextPage()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => <Comment comment={item} />}
            ItemSeparatorComponent={Divider}
            style={GlobalStyles.flex1}
          />

          <CommentInput onCommentSend={onCommentSend} />
        </>
      )}
    </PageContainer>
  );
};

export default Comments;
