import {useState} from 'react';
import {View, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {InputAccessoryView, TextButton} from '../../../../Components';
import {useTheme} from '../../../../Hooks';
import getStyles from './CommentInput.styles';

const CommentInput: React.FC = () => {
  const theme = useTheme();
  const [comment, setComment] = useState('');

  const styles = getStyles(theme);

  return (
    <SafeAreaView edges={['bottom']} style={styles.writeCommentContainer}>
      <InputAccessoryView>
        <View style={styles.writeCommentContent}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Your comment..."
            placeholderTextColor={theme.colors.textLight}
            style={styles.writeCommentInput}
            keyboardAppearance={theme.dark ? 'dark' : 'default'}
          />

          <TextButton color="primary" showLoading>
            Send
          </TextButton>
        </View>
      </InputAccessoryView>
    </SafeAreaView>
  );
};

export default CommentInput;
