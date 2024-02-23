import {useState} from 'react';
import {BottomFixedInput, TextButton} from '../../../../Components';
import {useLanguage} from '../../../../Hooks';
import styles from './CommentInput.styles';
import {CommentInputProps} from './CommentInput.props';

const CommentInput: React.FC<CommentInputProps> = ({onCommentSend}) => {
  const language = useLanguage();

  const [comment, setComment] = useState('');

  return (
    <BottomFixedInput
      value={comment}
      onChangeText={setComment}
      placeholder={language.comments.comment_placeholder}
      style={styles.input}
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
};

export default CommentInput;
