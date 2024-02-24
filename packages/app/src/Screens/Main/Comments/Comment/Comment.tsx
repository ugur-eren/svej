import {View} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {ActionButton, Text, UserInfo} from '../../../../Components';
import {useMutation, useTheme} from '../../../../Hooks';
import {Author} from '../../../../Api/User/User.types';
import {CommentProps} from './Comment.props';
import getStyles from './Comment.styles';
import {CommentApi} from '../../../../Api';
import {ReactionType} from '../../../../Api/Comment/Comment.types';

const Comment: React.FC<CommentProps> = ({comment}) => {
  const theme = useTheme();

  const queryClient = useQueryClient();

  const doReaction = useMutation({
    mutationKey: ['reaction', comment.id],
    mutationFn: (reaction: ReactionType) => CommentApi.doReaction(comment.id, reaction),
  });

  const styles = getStyles(theme);

  const onReaction = async (reaction: ReactionType) => {
    await doReaction.mutateAsync(reaction, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['comments', comment.postId]});
      },
    });
  };

  return (
    <View style={styles.container}>
      <UserInfo
        user={comment.author as Author}
        timestamp={new Date(comment.createdAt).getTime()}
        small
      />

      <Text style={styles.content}>{comment.text}</Text>

      <View style={styles.actionButtons}>
        <ActionButton
          type="like"
          active={comment.liked}
          onPress={() => onReaction(comment.liked ? 'remove' : 'like')}
          count={comment._count.likes}
          containerStyle={styles.actionButton}
          small
        />

        <ActionButton
          type="dislike"
          active={comment.disliked}
          onPress={() => onReaction(comment.disliked ? 'remove' : 'dislike')}
          count={comment._count.dislikes}
          containerStyle={styles.actionButton}
          small
        />
      </View>
    </View>
  );
};

export default Comment;
