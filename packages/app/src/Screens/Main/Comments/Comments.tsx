import {FlatList} from 'react-native';
import Comment from './Comment/Comment';
import CommentInput from './CommentInput/CommentInput';
import {PageContainer} from '../../../Containers';
import {Header, Divider} from '../../../Components';
import {useLanguage, useQuery} from '../../../Hooks';
import {CommentApi} from '../../../Api';
import {GlobalStyles} from '../../../Styles';
import {CommentsScreenProps} from '../../../Types';

const Comments: React.FC<CommentsScreenProps> = ({route}) => {
  const {postId} = route.params;

  const language = useLanguage();

  const comments = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => CommentApi.getByPostId(postId),
  });

  // TODO: show loading indicator
  if (!comments.data) return null;

  return (
    <PageContainer>
      <Header title={language.comments.title} />

      <FlatList
        data={comments.data}
        ItemSeparatorComponent={Divider}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Comment comment={item} />}
        style={GlobalStyles.flex1}
        automaticallyAdjustKeyboardInsets
      />

      <CommentInput />
    </PageContainer>
  );
};

export default Comments;
