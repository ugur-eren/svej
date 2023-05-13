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
      <FlatList
        data={['', '', '']}
        ItemSeparatorComponent={Divider}
        renderItem={() => (
          <View style={styles.item}>
            <ProfileWidget />
          </View>
        )}
        ListHeaderComponent={<Header title={type === 'follows' ? 'Follows' : 'Followers'} />}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
      />
    </PageContainer>
  );
};

export default Relations;
