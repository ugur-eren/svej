import {View} from 'react-native';
import {ActionButton, Text, UserInfo} from '../../../../Components';
import {useTheme} from '../../../../Hooks';
import {Author} from '../../../../Api/User/User.types';
import {CommentProps} from './Comment.props';
import getStyles from './Comment.styles';

const Comment: React.FC<CommentProps> = ({comment}) => {
  const theme = useTheme();

  const styles = getStyles(theme);

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
          count={comment._count.likes}
          containerStyle={styles.actionButton}
          small
        />

        <ActionButton
          type="dislike"
          active
          count={comment._count.dislikes}
          containerStyle={styles.actionButton}
          small
        />
      </View>
    </View>
  );
};

export default Comment;
