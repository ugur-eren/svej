import {useCallback, useRef} from 'react';
import {View, type FlatList} from 'react-native';
import {MainHeader} from '../../../Components';
import {PostList} from '../../../Containers';
import {useQuery} from '../../../Hooks';
import {GlobalStyles} from '../../../Styles';
import {PostApi} from '../../../Api';

const Explore: React.FC = () => {
  const flatlistRef = useRef<FlatList>(null);

  const query = useQuery(
    {
      queryKey: ['posts'],
      queryFn: PostApi.getAll,
    },
    true,
  );

  const onLogoPress = useCallback(
    () => flatlistRef.current?.scrollToOffset({offset: 0}),
    [flatlistRef],
  );

  return (
    <View style={GlobalStyles.flex1}>
      <MainHeader onLogoPress={onLogoPress} />

      <PostList ref={flatlistRef} />
    </View>
  );
};

export default Explore;
