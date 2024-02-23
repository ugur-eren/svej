import {Zod} from 'common';
import {FlatList} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import Comment from './Comment/Comment';
import CommentInput from './CommentInput/CommentInput';
import {PageContainer} from '../../../Containers';
import {Header, Divider} from '../../../Components';
import {useLanguage, useMutation, useQuery, useShowToast} from '../../../Hooks';
import {CommentApi} from '../../../Api';
import {GlobalStyles} from '../../../Styles';
import {CommentsScreenProps} from '../../../Types';

const Comments: React.FC<CommentsScreenProps> = ({route}) => {
  const {postId} = route.params;

  const language = useLanguage();
  const showToast = useShowToast();

  const queryClient = useQueryClient();

  const comments = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => CommentApi.getByPostId(postId),
  });

  const sendComment = useMutation({
    mutationKey: ['comment-create', postId],
    mutationFn: (comment: string) => CommentApi.create({postId, text: comment}),
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

  // TODO: show loading indicator
  if (!comments.data) return null;

  return (
    <PageContainer>
      <Header title={language.comments.title} />

      <FlatList
        data={comments.data}
        ItemSeparatorComponent={Divider}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Comment comment={item} />}
        style={GlobalStyles.flex1}
        automaticallyAdjustKeyboardInsets
      />

      <CommentInput onCommentSend={onCommentSend} />
    </PageContainer>
  );
};

export default Comments;
