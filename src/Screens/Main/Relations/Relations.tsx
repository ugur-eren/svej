import {FlatList, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {PageContainer} from '../../../Containers';
import {Header, ProfileWidget} from '../../../Components';
import {MainRelationsScreenProps} from '../../../Typings/NavigationTypes';
import styles from './Relations.styles';

const Relations: React.FC<MainRelationsScreenProps> = ({route}) => {
  const {type} = route.params;

  return (
    <PageContainer>
      <Header title={type === 'follows' ? 'Follows' : 'Followers'} />

      <FlatList
        data={['', '', '']}
        ItemSeparatorComponent={Divider}
        renderItem={() => (
          <View style={styles.item}>
            <ProfileWidget />
          </View>
        )}
      />
    </PageContainer>
  );
};

export default Relations;
