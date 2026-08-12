import {Zod} from '@svej/common';
import {useRef, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {PageContainer} from '@/Containers';
import {Header, Divider, Placeholders} from '@/Components';
import {useInfiniteQuery, useLanguage, useMutation, useShowToast} from '@/Hooks';
import {CommentsApi, PostsApi} from '@/Api';
import {GlobalStyles} from '@/Styles';
import {CommentsScreenProps} from '@/Types';
import Comment from './Comment';
import CommentInput from './CommentInput';

const Comments: React.FC<CommentsScreenProps> = ({route}) => {
  const {postId} = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [editingComment, setEditingComment] = useState<CommentsApi.Comment | null>(null);

  const commentInputRef = useRef<CommentInput>(null);

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
    mutationKey: ['comment', 'create', postId],
    mutationFn: (comment: string) => PostsApi.createComment(postId, {text: comment}),
  });

  const editComment = useMutation({
    mutationKey: ['comment', 'edit'],
    mutationFn: (variables: {comment: string; commentId: string}) =>
      CommentsApi.editComment(variables.commentId, variables.comment),
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

    if (editingComment) {
      await editComment.mutateAsync(
        {comment, commentId: editingComment.id},
        {
          onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['comments', postId]});

            showToast({
              type: 'success',
              title: language.comments.comment_edited_title,
              message: language.comments.comment_edited_message,
            });

            setEditingComment(null);

            comments.refetch();
          },
        },
      );
    } else {
      await sendComment.mutateAsync(comment, {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['comments', postId]});

          showToast({
            type: 'success',
            title: language.comments.comment_created_title,
            message: language.comments.comment_created_message,
          });

          comments.refetch();
        },
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await comments.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const cancelEditing = () => {
    setEditingComment(null);
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
            renderItem={({item}) => (
              <Comment
                comment={item}
                onEditPress={() => {
                  setEditingComment(item);
                  commentInputRef.current?.setComment(item.text);
                }}
              />
            )}
            ItemSeparatorComponent={Divider}
            style={GlobalStyles.flex1}
          />

          <CommentInput
            ref={commentInputRef}
            onCommentSend={onCommentSend}
            editing={editingComment !== null}
            cancelEditing={cancelEditing}
          />
        </>
      )}
    </PageContainer>
  );
};

export default Comments;
