import {FlatList, View} from 'react-native';
import {Divider, Header, ProfileWidget} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useLanguage, useTheme} from '../../../Hooks';
import {SettingsBlockedUsersScreenProps} from '../../../Types';
import getStyles from './BlockedUsers.styles';

const BlockedUsers: React.FC<SettingsBlockedUsersScreenProps> = () => {
  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

  return (
    <PageContainer style={styles.container}>
      <Header title={language.settings.blocked_users} />

      <FlatList
        contentContainerStyle={styles.flatList}
        data={['', '', '', '', '', '', '', '']}
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

export default BlockedUsers;
