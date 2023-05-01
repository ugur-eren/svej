import {FlatList, View} from 'react-native';
import {Divider} from 'react-native-paper';
import Comment from './Comment/Comment';
import CommentInput from './CommentInput/CommentInput';
import {Header} from '../../../Components';
import {GlobalStyles} from '../../../Styles';

const Comments: React.FC = () => {
  return (
    <View style={GlobalStyles.flex1}>
      <Header title="Comments" />

      <FlatList
        data={['', '', '', '']}
        ItemSeparatorComponent={Divider}
        renderItem={() => <Comment />}
        style={GlobalStyles.flex1}
        automaticallyAdjustKeyboardInsets
        StickyHeaderComponent={() => <CommentInput />}
      />

      <CommentInput />
    </View>
  );
};

export default Comments;
