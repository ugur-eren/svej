import {forwardRef, useImperativeHandle, useState} from 'react';
import {View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {BottomFixedInput, Text, TextButton} from '@/Components';
import {useLanguage, useTheme} from '@/Hooks';
import getStyles from './styles';
import {CommentInputProps} from './props';

type CommentInputRef = {
  setComment: (newComment: string) => void;
};

type CommentInput = CommentInputRef;

const CommentInput = forwardRef<CommentInputRef, CommentInputProps>(
  ({onCommentSend, editing, cancelEditing}, ref) => {
    const theme = useTheme();
    const language = useLanguage();

    const [comment, setComment] = useState('');

    useImperativeHandle(ref, () => ({
      setComment: (newComment: string) => {
        setComment(newComment);
      },
    }));

    const styles = getStyles(theme);

    const onCancelEditingPress = () => {
      setComment('');
      cancelEditing();
    };

    return (
      <BottomFixedInput
        value={comment}
        onChangeText={setComment}
        placeholder={language.comments.comment_placeholder}
        style={styles.input}
        top={
          editing ? (
            <View style={styles.editingContainer}>
              <Text>Editing comment</Text>
              <IconButton icon="x" size={21} onPress={onCancelEditingPress} />
            </View>
          ) : undefined
        }
        right={
          <TextButton
            color="primary"
            showLoading
            onPress={() => {
              setComment('');
              return onCommentSend(comment);
            }}
          >
            Send
          </TextButton>
        }
      />
    );
  },
);

export default CommentInput;
