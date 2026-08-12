import {Zod} from '@svej/common';
import {memo} from 'react';
import {View} from 'react-native';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import Text from '@/Components/Text';
import UserInfo from '@/Components/UserInfo';
import TextButton from '@/Components/TextButton';
import Touchable from '@/Components/Touchable';
import PostContent from '@/Components/PostContent';
import ActionButton from '@/Components/ActionButton';
import {Post as PostPlaceholder} from '@/Components/Placeholders/Post';
import {useLanguage, useMutation, useOpenModal, useQuery, useTheme} from '@/Hooks';
import {PostsApi, UsersApi, MediasApi} from '@/Api';
import {MainNavigationProp} from '@/Types';
import getStyles from './styles';

export type PostProps = {
  postId: string;
};

const Post: React.FC<PostProps> = ({postId}) => {
  const theme = useTheme();
  const language = useLanguage();
  const navigation = useNavigation<MainNavigationProp>();

  const openModal = useOpenModal();

  const {data: post, isLoading} = useQuery({
    queryKey: ['post', postId],
    queryFn: () => PostsApi.getById(postId),
    staleTime: 5 * 60 * 1_000,
  });

  const queryClient = useQueryClient();

  const react = useMutation({
    mutationKey: ['react', postId],
    mutationFn: (reaction: Zod.Reaction.TYPES) => PostsApi.react(postId, reaction),
  });

  const removeReaction = useMutation({
    mutationKey: ['removeReaction', postId],
    mutationFn: () => PostsApi.removeReaction(postId),
  });

  const styles = getStyles(theme);

  const onCommentsPress = () => navigation.navigate('Comments', {postId});

  const onReaction = async (reaction: Zod.Reaction.ALL_TYPES) => {
    if (reaction === Zod.Reaction.ALL_TYPES.NONE) {
      await removeReaction.mutateAsync(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['post', postId]});
        },
      });
    } else {
      await react.mutateAsync(reaction, {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['post', postId]});
        },
      });
    }
  };

  if (!post || isLoading) return <PostPlaceholder />;

  return (
    <View style={styles.container}>
      <UserInfo
        user={post.author as UsersApi.Author}
        timestamp={new Date(post.createdAt).getTime()}
        onActionsPress={() => openModal('postActions', {post})}
      />

      {post.description ? <Text style={styles.description}>{post.description}</Text> : null}

      <PostContent
        onLike={() => onReaction(Zod.Reaction.ALL_TYPES.LIKE)}
        data={post.medias.map((media) => ({
          type: (
            {
              VIDEO: 'video',
              IMAGE: 'image',
            } as const
          )[media.type],
          ratio: media.width / media.height,
          uri: MediasApi.getFileURL(media.fileKey),
          blurhash: media.blurhash ?? undefined,
        }))}
      />

      <View style={styles.bottom}>
        <View style={styles.actionButtons}>
          <ActionButton
            type="like"
            active={post.liked}
            count={post._count.likes}
            onPress={() =>
              onReaction(post.liked ? Zod.Reaction.ALL_TYPES.NONE : Zod.Reaction.ALL_TYPES.LIKE)
            }
          />

          <ActionButton
            type="dislike"
            active={post.disliked}
            count={post._count.dislikes}
            onPress={() =>
              onReaction(
                post.disliked ? Zod.Reaction.ALL_TYPES.NONE : Zod.Reaction.ALL_TYPES.DISLIKE,
              )
            }
          />

          {/* TODO: repost feature currently doesnt exists */}
          {/* <ActionButton type="repost" count={0} /> */}
        </View>

        <TextButton align="right" onPress={onCommentsPress}>
          {post._count.comments} {language.common.comments}
        </TextButton>
      </View>

      <Divider style={styles.divider} />

      <Touchable style={styles.comments} onPress={onCommentsPress}>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Text weight="bold">{comment.author.username}</Text>

              <Text>{comment.text}</Text>
            </View>
          ))
        ) : (
          <Text>{language.post.no_comments}</Text>
        )}
      </Touchable>
    </View>
  );
};

export default memo(Post);
