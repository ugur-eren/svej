import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  RootStackParams,
  AuthStackParams,
  SettingsStackParams,
  BottomStackParams,
  MainStackParams,
} from './Types';
import {useLanguage, useTheme} from './Hooks';
import {Typography} from './Styles';
import {ThemedStyleSheet} from './Utils/ThemedStyleSheet';
import {IsAndroid} from './Utils/Helpers';
import {
  TabBarBellIcon,
  TabBarCompassIcon,
  TabBarPlusSquareIcon,
  TabBarUserIcon,
} from './Utils/CommonComponents';
import {Selectors, useAppSelector} from './Redux';

// Auth
import AuthLogin from './Screens/Auth/Login/Login';
import AuthRegister from './Screens/Auth/Register/Register';

// Settings
import Settings from './Screens/Settings/Settings/Settings';
import ChangePassword from './Screens/Settings/ChangePassword/ChangePassword';
import BlockedUsers from './Screens/Settings/BlockedUsers/BlockedUsers';
import EditProfile from './Screens/Settings/EditProfile/EditProfile';

// Main
import Explore from './Screens/Main/Explore/Explore';
import Profile from './Screens/Main/Profile/Profile';
import Comments from './Screens/Main/Comments/Comments';
import Share from './Screens/Main/Share/Share';
import ShareInit from './Screens/Main/Share/ShareInit';
import ImageViewer from './Screens/Main/ImageViewer/ImageViewer';
import Search from './Screens/Main/Search/Search';
import Notifications from './Screens/Main/Notifications/Notifications';
import Relations from './Screens/Main/Relations/Relations';
import Chats from './Screens/Main/Chats/Chats';
import Chat from './Screens/Main/Chat/Chat';

// Navigators
const RootStack = createNativeStackNavigator<RootStackParams>();
const AuthStack = createNativeStackNavigator<AuthStackParams>();
const SettingsStack = createNativeStackNavigator<SettingsStackParams>();
const BottomStack = createBottomTabNavigator<BottomStackParams>();
const MainStack = createNativeStackNavigator<MainStackParams>();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={AuthLogin} />
      <AuthStack.Screen name="Register" component={AuthRegister} />
    </AuthStack.Navigator>
  );
};

const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator initialRouteName="Settings" screenOptions={{headerShown: false}}>
      <SettingsStack.Screen name="Settings" component={Settings} />
      <SettingsStack.Screen name="ChangePassword" component={ChangePassword} />
      <SettingsStack.Screen name="BlockedUsers" component={BlockedUsers} />
      <SettingsStack.Screen name="EditProfile" component={EditProfile} />
    </SettingsStack.Navigator>
  );
};

const BottomStackNavigator = () => {
  const theme = useTheme();
  const language = useLanguage();
  const user = useAppSelector(Selectors.Auth.User);

  const styles = getBottomBarStyles(theme);

  return (
    <BottomStack.Navigator
      initialRouteName="Explore"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
        tabBarBadgeStyle: styles.tabBarBadgeStyle,
      }}
    >
      <BottomStack.Screen
        name="Explore"
        component={Explore}
        options={{title: language.explore.title, tabBarIcon: TabBarCompassIcon}}
      />
      <BottomStack.Screen
        name="ShareInit"
        component={ShareInit}
        options={{title: language.share.title, tabBarIcon: TabBarPlusSquareIcon}}
      />
      <BottomStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          title: language.notifications.title,
          tabBarIcon: TabBarBellIcon,
          tabBarBadge: '3',
        }}
      />
      <BottomStack.Screen
        name="Profile"
        component={Profile}
        initialParams={{hideBack: true, username: user?.username, userId: user?.id}}
        options={{title: language.profile.title, tabBarIcon: TabBarUserIcon}}
      />
    </BottomStack.Navigator>
  );
};

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator initialRouteName="BottomStack" screenOptions={{headerShown: false}}>
      <MainStack.Screen name="BottomStack" component={BottomStackNavigator} />
      <MainStack.Screen name="SettingsStack" component={SettingsStackNavigator} />
      <MainStack.Screen name="Explore" component={Explore} />
      <MainStack.Screen name="Profile" component={Profile} />
      <MainStack.Screen name="Share" component={Share} />
      <MainStack.Screen name="Comments" component={Comments} />
      <MainStack.Screen name="ImageViewer" component={ImageViewer} />
      <MainStack.Screen name="Search" component={Search} />
      <MainStack.Screen name="Notifications" component={Notifications} />
      <MainStack.Screen name="Relations" component={Relations} />
      <MainStack.Screen name="Chats" component={Chats} />
      <MainStack.Screen name="Chat" component={Chat} />
    </MainStack.Navigator>
  );
};

const Router: React.FC = () => {
  const theme = useTheme();
  const authenticated = useAppSelector(Selectors.Auth.Authenticated);

  return (
    <NavigationContainer theme={theme.navigation}>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        {authenticated ? (
          <RootStack.Screen name="MainStack" component={MainStackNavigator} />
        ) : (
          <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const getBottomBarStyles = ThemedStyleSheet((theme) => ({
  tabBarLabelStyle: {
    ...Typography.medium,
    fontSize: 12,
  },
  tabBarStyle: IsAndroid
    ? {
        paddingBottom: 4,
      }
    : {},
  tabBarBadgeStyle: {
    color: theme.colors.buttonText,
    fontSize: 10,
    lineHeight: 16,
    height: 16,
    minWidth: 16,
    borderRadius: 8,
    textAlign: 'center',
  },
}));

export default Router;
