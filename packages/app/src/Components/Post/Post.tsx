import {memo} from 'react';
import {View} from 'react-native';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Text from '../Text/Text';
import UserInfo from '../UserInfo/UserInfo';
import TextButton from '../TextButton/TextButton';
import Touchable from '../Touchable/Touchable';
import PostContent from '../PostContent/PostContent';
import ActionButton from '../ActionButton/ActionButton';
import {useLanguage, useTheme} from '../../Hooks';
import type {Post as PostType} from '../../Api/Post/Post.types';
import type {Author} from '../../Api/User/User.types';
import {MainNavigationProp} from '../../Types';
import getStyles from './Post.styles';

export type PostProps = {
  post: PostType;
};

const Post: React.FC<PostProps> = ({post}) => {
  const theme = useTheme();
  const language = useLanguage();
  const navigation = useNavigation<MainNavigationProp>();

  const styles = getStyles(theme);

  const onCommentsPress = () => navigation.navigate('Comments');

  return (
    <View style={styles.container}>
      <UserInfo user={post.author as Author} timestamp={new Date(post.createdAt).getTime()} />

      {post.description ? <Text style={styles.description}>{post.description}</Text> : null}

      <PostContent
        data={post.medias.map((media) => ({
          type: (
            {
              VIDEO: 'video',
              IMAGE: 'image',
            } as const
          )[media.type],
          ratio: media.width / media.height,
          uri: media.url,
        }))}
      />

      <View style={styles.bottom}>
        <View style={styles.actionButtons}>
          <ActionButton type="like" active count={post._count.likes} />

          <ActionButton type="dislike" count={post._count.dislikes} />

          {/* TODO: repost feature currently doesnt exists */}
          {/* <ActionButton type="repost" count={0} /> */}
        </View>

        <TextButton align="right" onPress={onCommentsPress}>
          {post._count.comments} {language.common.comments}
        </TextButton>
      </View>

      <Divider style={styles.divider} />

      <Touchable style={styles.comments} onPress={onCommentsPress}>
        {/* TODO: featured comments */}
        <Text>{language.post.no_comments}</Text>
      </Touchable>
    </View>
  );
};

export default memo(Post);
