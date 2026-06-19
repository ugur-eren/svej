import {Zod} from '@svej/common';
import {View} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {ActionButton, Text, UserInfo} from '@/Components';
import {useMutation, useTheme} from '@/Hooks';
import {CommentsApi, UsersApi} from '@/Api';
import {CommentProps} from './props';
import getStyles from './styles';

const Comment: React.FC<CommentProps> = ({comment}) => {
  const theme = useTheme();

  const queryClient = useQueryClient();

  const react = useMutation({
    mutationKey: ['react', comment.id],
    mutationFn: (reaction: Zod.Reaction.TYPES) => CommentsApi.react(comment.id, reaction),
  });

  const removeReaction = useMutation({
    mutationKey: ['removeReaction', comment.id],
    mutationFn: () => CommentsApi.removeReaction(comment.id),
  });

  const styles = getStyles(theme);

  const onReaction = async (reaction: Zod.Reaction.ALL_TYPES) => {
    if (reaction === Zod.Reaction.ALL_TYPES.NONE) {
      await removeReaction.mutateAsync(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['comments', comment.postId]});
        },
      });
    } else {
      await react.mutateAsync(reaction, {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['comments', comment.postId]});
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <UserInfo
        user={comment.author as UsersApi.Author}
        timestamp={new Date(comment.createdAt).getTime()}
        small
      />

      <Text style={styles.content}>{comment.text}</Text>

      <View style={styles.actionButtons}>
        <ActionButton
          type="like"
          active={comment.liked}
          onPress={() =>
            onReaction(comment.liked ? Zod.Reaction.ALL_TYPES.NONE : Zod.Reaction.ALL_TYPES.LIKE)
          }
          count={comment._count.likes}
          containerStyle={styles.actionButton}
          small
        />

        <ActionButton
          type="dislike"
          active={comment.disliked}
          onPress={() =>
            onReaction(
              comment.disliked ? Zod.Reaction.ALL_TYPES.NONE : Zod.Reaction.ALL_TYPES.DISLIKE,
            )
          }
          count={comment._count.dislikes}
          containerStyle={styles.actionButton}
          small
        />
      </View>
    </View>
  );
};

export default Comment;
