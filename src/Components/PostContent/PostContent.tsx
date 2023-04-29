import {View} from 'react-native';
import {PostContentProps} from './PostContent.props';
import styles from './PostContent.styles';

const PostContent: React.FC<PostContentProps> = (props) => {
  const {data} = props;

  return (
    <View style={styles.container}>
      <View />
    </View>
  );
};

export default PostContent;
