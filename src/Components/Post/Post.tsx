import {View} from 'react-native';
import {Divider} from 'react-native-paper';
import Text from '../Text/Text';
import UserInfo from '../UserInfo/UserInfo';
import TextButton from '../TextButton/TextButton';
import Touchable from '../Touchable/Touchable';
import PostContent from '../PostContent/PostContent';
import {useTheme} from '../../Hooks';
import getStyles from './Post.styles';

const Post: React.FC = () => {
  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <UserInfo timestamp={1682794718492} />

      <Text style={styles.description}>
        Eiusmod laborum adipisicing do mollit voluptate exercitation esse. Pariatur amet anim ex
        velit. Tempor elit velit sit fugiat ad duis commodo veniam eu. Proident consectetur
        voluptate sint irure id et ipsum officia ea est ex sint in.
      </Text>

      <PostContent
        data={[
          {
            type: 'image',
            ratio: 1,
            uri: `https://unsplash.it/600/600/?random=${Math.random()}`,
          },
          {
            type: 'video',
            ratio: 1,
            uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          {
            type: 'image',
            ratio: 1.5,
            uri: `https://unsplash.it/900/600/?random=${Math.random()}`,
          },
          {
            type: 'image',
            ratio: 1,
            uri: `https://unsplash.it/600/600/?random=${Math.random()}`,
          },
        ]}
      />

      <View style={styles.bottom}>
        <View style={styles.actionButtons}>
          <Text>Like</Text>
          <Text>Dislike</Text>
        </View>

        <TextButton align="right">0 Comments</TextButton>
      </View>

      <Divider style={styles.divider} />

      <Touchable style={styles.comments}>
        <Text>There are no comments. Be the first one!</Text>
      </Touchable>
    </View>
  );
};

export default Post;
