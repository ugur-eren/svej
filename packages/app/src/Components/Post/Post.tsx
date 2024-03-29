import {memo} from 'react';
import {View} from 'react-native';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import Text from '../Text/Text';
import UserInfo from '../UserInfo/UserInfo';
import TextButton from '../TextButton/TextButton';
import Touchable from '../Touchable/Touchable';
import PostContent from '../PostContent/PostContent';
import ActionButton from '../ActionButton/ActionButton';
import {useLanguage, useMutation, usePost, useTheme} from '../../Hooks';
import {PostApi, FileApi} from '../../Api';
import type {Author} from '../../Api/User/User.types';
import type {ReactionType} from '../../Api/Post/Post.types';
import {MainNavigationProp} from '../../Types';
import getStyles from './Post.styles';
import {Post as PostPlaceholder} from '../Placeholders/Post';

export type PostProps = {
  postId: string;
};

const Post: React.FC<PostProps> = ({postId}) => {
  const theme = useTheme();
  const language = useLanguage();
  const navigation = useNavigation<MainNavigationProp>();

  const post = usePost(postId);

  const queryClient = useQueryClient();

  const doReaction = useMutation({
    mutationKey: ['reaction', postId],
    mutationFn: (reaction: ReactionType) => PostApi.doReaction(postId, reaction),
  });

  const styles = getStyles(theme);

  const onCommentsPress = () => navigation.navigate('Comments', {postId});

  const onReaction = async (reaction: ReactionType) => {
    await doReaction.mutateAsync(reaction, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['post', postId]});
      },
    });
  };

  if (!post) return <PostPlaceholder />;

  return (
    <View style={styles.container}>
      <UserInfo user={post.author as Author} timestamp={new Date(post.createdAt).getTime()} />

      {post.description ? <Text style={styles.description}>{post.description}</Text> : null}

      <PostContent
        onLike={() => onReaction('like')}
        data={post.medias.map((media) => ({
          type: (
            {
              VIDEO: 'video',
              IMAGE: 'image',
            } as const
          )[media.type],
          ratio: media.width / media.height,
          uri: FileApi.getFileURL(media.fileKey),
        }))}
      />

      <View style={styles.bottom}>
        <View style={styles.actionButtons}>
          <ActionButton
            type="like"
            active={post.liked}
            count={post._count.likes}
            onPress={() => onReaction(post.liked ? 'remove' : 'like')}
          />

          <ActionButton
            type="dislike"
            active={post.disliked}
            count={post._count.dislikes}
            onPress={() => onReaction(post.disliked ? 'remove' : 'dislike')}
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
