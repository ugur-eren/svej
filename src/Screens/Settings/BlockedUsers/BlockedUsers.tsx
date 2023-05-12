import {FlatList} from 'react-native';
import {Header, ProfileWidget} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useTheme} from '../../../Hooks';
import {SettingsBlockedUsersScreenProps} from '../../../Typings/NavigationTypes';
import getStyles from './BlockedUsers.styles';

const BlockedUsers: React.FC<SettingsBlockedUsersScreenProps> = () => {
  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <PageContainer style={styles.container}>
      <Header title="Blocked Users" />

      <FlatList
        contentContainerStyle={styles.flatList}
        data={['', '', '', '', '', '', '', '']}
        renderItem={() => <ProfileWidget />}
      />
    </PageContainer>
  );
};

export default BlockedUsers;
