import {useCallback, useState} from 'react';
import {ScrollView} from 'react-native';
import {List, Switch} from 'react-native-paper';
import {Header, ListItem, ListMenu} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useLanguage, useTheme} from '../../../Hooks';
import * as Languages from '../../../Languages';
import {GlobalStyles} from '../../../Styles';
import {SettingsScreenProps} from '../../../Types';
import {SettingsActions, type SettingsState, useAppDispatch} from '../../../Redux';

type Props = SettingsScreenProps;

const Settings: React.FC<Props> = ({navigation}) => {
  const theme = useTheme();
  const language = useLanguage();
  const dispatch = useAppDispatch();

  const [notifications, setNotifications] = useState(false);

  const onLanguageSelect = useCallback(
    (key: string) => {
      dispatch(SettingsActions.setLanguage(key as SettingsState['language']));
    },
    [dispatch],
  );

  const onThemeSelect = useCallback(
    (key: string) => {
      dispatch(SettingsActions.setTheme(key as SettingsState['theme']));
    },
    [dispatch],
  );

  const NotificationsSwitch = useCallback(
    () => (
      <Switch
        value={notifications}
        onValueChange={() => setNotifications((curr) => !curr)}
        color={theme.colors.primary}
      />
    ),
    [notifications, theme.colors.primary],
  );

  return (
    <PageContainer>
      <Header title={language.settings.title} />

      <ScrollView>
        <List.Section>
          <ListItem
            title={language.settings.edit_profile}
            icon="edit-3"
            onPress={() => navigation.navigate('EditProfile')}
          />

          <ListItem
            title={language.settings.change_password}
            icon="lock"
            onPress={() => navigation.navigate('ChangePassword')}
          />

          <ListMenu
            title={language.common.theme}
            iconName="moon"
            anchorTitle={theme.dark ? 'Dark' : 'Light'}
            onItemPress={onThemeSelect}
            data={{
              default: language.settings.system_default,
              dark: language.settings.dark_theme,
              light: language.settings.light_theme,
            }}
          />

          <ListMenu
            title={language.common.language}
            iconName="flag"
            anchorTitle={language.about_language.name}
            onItemPress={onLanguageSelect}
            data={Object.fromEntries(
              Object.entries(Languages).map(([key, lang]) => [key, lang.about_language.name]),
            )}
          />

          <ListItem
            title={language.settings.notifications}
            icon="bell"
            onPress={() => setNotifications((curr) => !curr)}
            right={NotificationsSwitch}
            style={GlobalStyles.paddingVerticalNone}
          />

          <ListItem
            title={language.settings.blocked_users}
            icon="alert-octagon"
            onPress={() => navigation.navigate('BlockedUsers')}
          />

          <ListItem title={language.common.logout} icon="log-out" />
        </List.Section>
      </ScrollView>
    </PageContainer>
  );
};

export default Settings;
