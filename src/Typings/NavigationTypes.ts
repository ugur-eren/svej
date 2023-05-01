import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps, NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParams = {
  AuthStack: NavigatorScreenParams<AuthStackParams>;
  MainStack: NavigatorScreenParams<MainStackParams>;
};

export type AuthStackParams = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParams = {
  Explore: undefined;
  Profile: undefined;
  Settings: undefined;
  Comments: undefined;
};

// Root Stack
export type RootStackNavigationProps = NativeStackNavigationProp<RootStackParams>;
export type RootStackScreenProps = NativeStackScreenProps<RootStackParams>;

// Auth
export type AuthLoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, 'Login'>,
  NativeStackScreenProps<RootStackParams>
>;
export type AuthRegisterScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, 'Register'>,
  NativeStackScreenProps<RootStackParams>
>;

// Main
export type MainExploreScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Explore'>,
  NativeStackScreenProps<RootStackParams>
>;
export type MainProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Profile'>,
  NativeStackScreenProps<RootStackParams>
>;
export type MainSettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Settings'>,
  NativeStackScreenProps<RootStackParams>
>;
export type MainCommentsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Comments'>,
  NativeStackScreenProps<RootStackParams>
>;
