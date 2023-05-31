import {FlatList} from 'react-native';
import Comment from './Comment/Comment';
import CommentInput from './CommentInput/CommentInput';
import {PageContainer} from '../../../Containers';
import {Header, Divider} from '../../../Components';
import {useLanguage} from '../../../Hooks';
import {GlobalStyles} from '../../../Styles';

const Comments: React.FC = () => {
  const language = useLanguage();

  return (
    <PageContainer>
      <Header title={language.comments.title} />

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
