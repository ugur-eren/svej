import {useState} from 'react';
import {BottomFixedInput, TextButton} from '../../../../Components';
import {useLanguage} from '../../../../Hooks';
import styles from './CommentInput.styles';

const CommentInput: React.FC = () => {
  const language = useLanguage();

  const [comment, setComment] = useState('');

  return (
    <BottomFixedInput
      value={comment}
      onChangeText={setComment}
      placeholder={language.comments.comment_placeholder}
      style={styles.input}
      right={
        <TextButton color="primary" showLoading>
          Send
        </TextButton>
      }
    />
  );
};

export default CommentInput;
