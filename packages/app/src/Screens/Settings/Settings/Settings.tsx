import {useCallback, useMemo, useState} from 'react';
import {ScrollView} from 'react-native';
import {List, Switch} from 'react-native-paper';
import {Header, ListItem, ListMenu} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useLanguage, useMutation, useTheme} from '../../../Hooks';
import {AuthApi} from '../../../Api';
import * as Languages from '../../../Languages';
import {GlobalStyles} from '../../../Styles';
import {SettingsScreenProps} from '../../../Types';
import {
  SettingsActions,
  type SettingsState,
  useAppDispatch,
  useAppSelector,
  Selectors,
  AuthActions,
} from '../../../Redux';
import Storage from '../../../Utils/Storage';

type Props = SettingsScreenProps;

const Settings: React.FC<Props> = ({navigation}) => {
  const theme = useTheme();
  const language = useLanguage();
  const settings = useAppSelector(Selectors.Settings.Settings);
  const dispatch = useAppDispatch();

  const [notifications, setNotifications] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: AuthApi.logout,
  });

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

  const onLogoutPress = useCallback(async () => {
    await logoutMutation.mutateAsync(undefined);

    dispatch(AuthActions.setAuthenticated(false));
    dispatch(AuthActions.setUser());

    await Storage.set('token', '');
  }, [logoutMutation, dispatch]);

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

  const themeData = useMemo(
    () => ({
      default: language.settings.system_default,
      dark: language.settings.dark_theme,
      light: language.settings.light_theme,
    }),
    [language.settings],
  );

  const languageData = useMemo(
    () => ({
      default: language.settings.system_default,
      ...Object.fromEntries(
        Object.entries(Languages).map(([key, lang]) => [key, lang.about_language.name]),
      ),
    }),
    [language.settings],
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
            anchorTitle={themeData[settings.theme]}
            onItemPress={onThemeSelect}
            data={themeData}
          />

          <ListMenu
            title={language.common.language}
            iconName="flag"
            anchorTitle={
              settings.language === 'default'
                ? language.settings.system_default
                : language.about_language.name
            }
            onItemPress={onLanguageSelect}
            data={languageData}
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

          <ListItem title={language.common.logout} icon="log-out" onPress={onLogoutPress} />
        </List.Section>
      </ScrollView>
    </PageContainer>
  );
};

export default Settings;
