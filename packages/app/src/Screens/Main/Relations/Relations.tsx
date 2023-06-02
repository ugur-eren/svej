import {FlatList, View} from 'react-native';
import {PageContainer} from '../../../Containers';
import {Divider, Header, ProfileWidget} from '../../../Components';
import {useLanguage, useTheme} from '../../../Hooks';
import {RelationsScreenProps} from '../../../Types';
import getStyles from './Relations.styles';

const Relations: React.FC<RelationsScreenProps> = ({route}) => {
  const {type} = route.params;

  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

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
