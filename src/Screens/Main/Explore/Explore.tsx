import {View} from 'react-native';
import {MainHeader} from '../../../Components';
import {PostList} from '../../../Containers';
import {GlobalStyles} from '../../../Styles';

const Explore: React.FC = () => {
  return (
    <View style={GlobalStyles.flex1}>
      <PostList
        ListHeaderComponent={MainHeader}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
      />
    </View>
  );
};

export default Explore;
