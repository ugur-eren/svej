import {useState} from 'react';
import {TextInput, FlatList, View} from 'react-native';
import {Appbar, Divider, IconButton, Surface} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLanguage, useTheme} from '../../../Hooks';
import getStyles from './Search.styles';
import {SearchScreenProps} from '../../../Types';
import {PageContainer} from '../../../Containers';
import {ProfileWidget} from '../../../Components';

const Search: React.FC<SearchScreenProps> = (props) => {
  const {navigation} = props;

  const theme = useTheme();
  const language = useLanguage();

  const [searchText, setSearchText] = useState('');

  const styles = getStyles(theme);

  return (
    <PageContainer>
      <Surface elevation={2}>
        <SafeAreaView edges={['top']} style={styles.topContainer}>
          <Appbar.BackAction color={theme.colors.text} onPress={navigation.goBack} />

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={language.search.search_placeholder}
            style={styles.searchInput}
            placeholderTextColor={theme.colors.textLight}
          />

          <IconButton icon="search" />
        </SafeAreaView>
      </Surface>

      <FlatList
        data={['', '', '']}
        renderItem={() => (
          <View style={styles.item}>
            <ProfileWidget />
          </View>
        )}
        ItemSeparatorComponent={Divider}
      />
    </PageContainer>
  );
};

export default Search;
