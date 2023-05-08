import {FlatList} from 'react-native';
import {Divider} from 'react-native-paper';
import {PageContainer} from '../../../Containers';
import {Header, ProfileWidget} from '../../../Components';
import {MainRelationsScreenProps} from '../../../Typings/NavigationTypes';

const Relations: React.FC<MainRelationsScreenProps> = ({route}) => {
  const {type} = route.params;

  return (
    <PageContainer>
      <Header title={type === 'follows' ? 'Follows' : 'Followers'} />

      <FlatList
        data={['', '', '']}
        ItemSeparatorComponent={Divider}
        renderItem={() => <ProfileWidget />}
      />
    </PageContainer>
  );
};

export default Relations;
