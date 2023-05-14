import {FlatList} from 'react-native';
import {Divider} from 'react-native-paper';
import Comment from './Comment/Comment';
import CommentInput from './CommentInput/CommentInput';
import {Header} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {GlobalStyles} from '../../../Styles';

const Comments: React.FC = () => {
  return (
    <PageContainer>
      <Header title="Comments" />

      <FlatList
        data={['', '', '', '', '', '']}
        ItemSeparatorComponent={Divider}
        renderItem={() => <Comment />}
        style={GlobalStyles.flex1}
        automaticallyAdjustKeyboardInsets
      />

      <CommentInput />
    </PageContainer>
  );
};

export default Comments;
