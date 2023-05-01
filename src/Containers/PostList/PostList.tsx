import {forwardRef} from 'react';
import {FlatList, View} from 'react-native';
import {PostListProps} from './PostList.props';
import styles from './PostList.styles';
import {Post} from '../../Components';
import {IsAndroid} from '../../Utils/Helpers';

const ItemSeparatorComponent = () => <View style={styles.separator} />;

const PostList = forwardRef<FlatList, PostListProps>((props, ref) => {
  const {...flatlistProps} = props;

  return (
    <FlatList
      ref={ref}
      ItemSeparatorComponent={ItemSeparatorComponent}
      removeClippedSubviews={IsAndroid}
      data={['', '']}
      renderItem={() => <Post />}
      {...flatlistProps}
    />
  );
});

export default PostList;
