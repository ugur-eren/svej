import {Config} from '@svej/common';
import {useCallback, useState} from 'react';
import {TextInput, FlatList, View} from 'react-native';
import {Appbar, IconButton, Surface} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {skipToken, useQueryClient} from '@tanstack/react-query';
import {PageContainer} from '@/Containers';
import {Divider, ProfileWidget} from '@/Components';
import {useDebounce, useLanguage, useQuery, useShowToast, useTheme} from '@/Hooks';
import {UsersApi} from '@/Api';
import {parseLanguageParts} from '@/Utils/Helpers';
import {SearchScreenProps} from '@/Types';
import getStyles from './styles';

const Search: React.FC<SearchScreenProps> = (props) => {
  const {navigation} = props;

  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

  const [inputText, setInputText] = useState('');
  const searchText = useDebounce(inputText, 350);

  const showToast = useShowToast();

  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ['search', searchText.trim()],
    queryFn:
      searchText.trim().length >= Config.searchQueryMinLength
        ? () => UsersApi.search(searchText.trim())
        : skipToken,
  });

  const invalidateSearch = useCallback(() => {
    queryClient.invalidateQueries({queryKey: ['search']});
  }, [queryClient]);

  const onInputTextChange = useCallback(
    (text: string) => {
      if (text.trim().length > Config.searchQueryMaxLength) {
        showToast({
          type: 'warning',
          title: language.search.query_too_long_title,
          message: parseLanguageParts(language.search.query_too_long_message, {
            max: Config.searchQueryMaxLength,
          }),
        });
        return;
      }

      setInputText(text);
    },
    [setInputText, language, showToast],
  );

  return (
    <PageContainer>
      <Surface elevation={2}>
        <SafeAreaView edges={['top']} style={styles.topContainer}>
          <Appbar.BackAction color={theme.colors.text} onPress={navigation.goBack} />

          <TextInput
            value={inputText}
            onChangeText={onInputTextChange}
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
