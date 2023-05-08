import {ImageSourcePropType} from 'react-native';
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

export type BottomStackParams = {
  Explore: undefined;
  Share: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type MainStackParams = {
  BottomStack: NavigatorScreenParams<BottomStackParams>;
  Explore: undefined;
  Profile: undefined;
  Share: undefined;
  Settings: undefined;
  Comments: undefined;
  ImageViewer: {
    title: string;
    image: string | ImageSourcePropType;
  };
  Search: undefined;
  Notifications: undefined;
  Relations: {
    type: 'followers' | 'follows';
  };
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
export type MainShareScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Share'>,
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
export type MainImageViewerScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'ImageViewer'>,
  NativeStackScreenProps<RootStackParams>
>;
export type MainSearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Search'>,
  NativeStackScreenProps<RootStackParams>
>;
export type MainNotificationsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Notifications'>,
  NativeStackScreenProps<RootStackParams>
>;
export type MainRelationsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Relations'>,
  NativeStackScreenProps<RootStackParams>
>;
