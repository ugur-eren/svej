import {useCallback, useEffect, useState} from 'react';
import {TextInput, FlatList, View} from 'react-native';
import {Appbar, IconButton, Surface} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useQueryClient} from '@tanstack/react-query';
import {PageContainer} from '../../../Containers';
import {Divider, ProfileWidget} from '../../../Components';
import {useLanguage, useQuery, useTheme} from '../../../Hooks';
import {UserApi} from '../../../Api';
import {SearchScreenProps} from '../../../Types';
import getStyles from './Search.styles';

const Search: React.FC<SearchScreenProps> = (props) => {
  const {navigation} = props;

  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchText(inputText);
    }, 350);

    return () => {
      clearTimeout(timeout);
    };
  }, [inputText]);

  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ['search', searchText],
    queryFn: () => UserApi.search(searchText),
  });

  const invalidateSearch = useCallback(() => {
    queryClient.invalidateQueries({queryKey: ['search']});
  }, [queryClient]);

  return (
    <PageContainer>
      <Surface elevation={2}>
        <SafeAreaView edges={['top']} style={styles.topContainer}>
          <Appbar.BackAction color={theme.colors.text} onPress={navigation.goBack} />

          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={language.search.search_placeholder}
            style={styles.searchInput}
            placeholderTextColor={theme.colors.textLight}
          />

          <IconButton icon="search" onPress={invalidateSearch} />
        </SafeAreaView>
      </Surface>

      <FlatList
        data={users.data || []}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.item}>
            <ProfileWidget user={item} />
          </View>
        )}
        ItemSeparatorComponent={Divider}
      />
    </PageContainer>
  );
};

export default Search;
