import {View} from 'react-native';
import {ActionButton, Text, UserInfo} from '../../../../Components';
import {useTheme} from '../../../../Hooks';
import getStyles from './Comment.styles';

const Comment: React.FC = () => {
  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <UserInfo timestamp={1682977964359} small />

      <Text style={styles.content}>Fugiat magna quis proident commodo quis consectetur.</Text>

      <View style={styles.actionButtons}>
        <ActionButton type="like" count={15} containerStyle={styles.actionButton} small />

        <ActionButton type="dislike" active count={2} containerStyle={styles.actionButton} small />
      </View>
    </View>
  );
};

export default Comment;
