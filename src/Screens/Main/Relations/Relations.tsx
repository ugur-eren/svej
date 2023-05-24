import {FlatList, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {PageContainer} from '../../../Containers';
import {Header, ProfileWidget} from '../../../Components';
import {useLanguage} from '../../../Hooks';
import {MainRelationsScreenProps} from '../../../Types';
import styles from './Relations.styles';

const Relations: React.FC<MainRelationsScreenProps> = ({route}) => {
  const {type} = route.params;

  const language = useLanguage();

  return (
    <PageContainer>
      <Header title={language.common[type]} />

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
