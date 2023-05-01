import {useCallback, useState} from 'react';
import {ScrollView} from 'react-native';
import {List, Switch} from 'react-native-paper';
import {Header, ListItem, ListMenu} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useLanguage, useTheme} from '../../../Hooks';
import * as Languages from '../../../Languages';
import {Theme} from '../../../Styles';
import {useChangeLanguage} from '../../../Hooks/Language';
import {useChangeTheme} from '../../../Hooks/Theming';
import {IsIOS} from '../../../Utils/Helpers';
import {MainSettingsScreenProps} from '../../../Typings/NavigationTypes';

type Props = MainSettingsScreenProps;

const Settings: React.FC<Props> = ({navigation}) => {
  const theme = useTheme();
  const language = useLanguage();

  const changeTheme = useChangeTheme();
  const changeLanguage = useChangeLanguage();

  const [notifications, setNotifications] = useState(false);

  const onLanguageSelect = useCallback(
    (key: string) => {
      // ESLint can't compute the type of the Languages object
      // And since there's no issue with the code, we can disable the rule
      // eslint-disable-next-line import/namespace
      changeLanguage(Languages[key as keyof typeof Languages]);
    },
    [changeLanguage],
  );

  const onThemeSelect = useCallback(
    (key: string) => {
      changeTheme(key === 'dark' ? Theme.DarkTheme : Theme.LightTheme);
    },
    [changeTheme],
  );

  return (
    <PageContainer>
      <Header title="Settings" />

      <ScrollView>
        <List.Section>
          <ListItem
            title="Edit Profile"
            icon="edit-3"
            onPress={() => navigation.navigate('EditProfile')}
          />

          <ListItem
            title="Change Password"
            icon="lock"
            onPress={() => navigation.navigate('ChangePassword')}
          />

          <ListMenu
            title="Theme"
            iconName="moon"
            anchorTitle={theme.dark ? 'Dark' : 'Light'}
            onItemPress={onThemeSelect}
            data={{dark: 'Dark Theme', light: 'Light Theme'}}
          />

          <ListMenu
            title="Language"
            iconName="flag"
            anchorTitle={language.about_language.name}
            onItemPress={onLanguageSelect}
            data={Object.fromEntries(
              Object.entries(Languages).map(([key, lang]) => [key, lang.about_language.name]),
            )}
          />

          <ListItem
            title="Notifications"
            icon="bell"
            onPress={() => setNotifications((curr) => !curr)}
            right={() => (
              <Switch
                value={notifications}
                style={IsIOS && {marginRight: 20}}
                onValueChange={() => setNotifications((curr) => !curr)}
                color={theme.colors.primary}
              />
            )}
          />

          <ListItem
            title="Blocked Users"
            icon="alert-octagon"
            onPress={() => navigation.navigate('BlockedUsers')}
          />

          <ListItem title="Logout" icon="log-out" />
        </List.Section>
      </ScrollView>
    </PageContainer>
  );
};

export default Settings;
