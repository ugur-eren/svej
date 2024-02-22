import {useCallback, useRef} from 'react';
import {View, type FlatList} from 'react-native';
import {MainHeader} from '../../../Components';
import {PostList} from '../../../Containers';
import {GlobalStyles} from '../../../Styles';

const Explore: React.FC = () => {
  const flatlistRef = useRef<FlatList>(null);

  const onLogoPress = useCallback(
    () => flatlistRef.current?.scrollToOffset({offset: 0}),
    [flatlistRef],
  );

  return (
    <View style={GlobalStyles.flex1}>
      <MainHeader onLogoPress={onLogoPress} />

      <PostList type="explore" ref={flatlistRef} />
    </View>
  );
};

export default Explore;
