import {useState} from 'react';
import {BottomFixedInput, TextButton} from '../../../../Components';
import styles from './CommentInput.styles';

const CommentInput: React.FC = () => {
  const [comment, setComment] = useState('');

  return (
    <BottomFixedInput
      value={comment}
      onChangeText={setComment}
      placeholder="Your comment..."
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
