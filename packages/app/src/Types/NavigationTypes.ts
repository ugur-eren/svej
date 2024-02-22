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

export type SettingsStackParams = {
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  BlockedUsers: undefined;
};

export type BottomStackParams = {
  Explore: undefined;
  ShareInit: undefined;
  Notifications: undefined;
  Profile: {
    userId: string;
    username: string;
  };
};

export type MainStackParams = {
  BottomStack: NavigatorScreenParams<BottomStackParams>;
  SettingsStack: NavigatorScreenParams<SettingsStackParams>;
  Explore: undefined;
  Profile: {
    userId: string;
    username: string;
  };
  Share: undefined;
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
  Chats: undefined;
  Chat: undefined;
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

// Settings
export type SettingsNavigationProp = NativeStackNavigationProp<SettingsStackParams>;

export type SettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingsStackParams, 'Settings'>,
  NativeStackScreenProps<RootStackParams>
>;
export type SettingsEditProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingsStackParams, 'EditProfile'>,
  NativeStackScreenProps<RootStackParams>
>;
export type SettingsChangePasswordScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingsStackParams, 'ChangePassword'>,
  NativeStackScreenProps<RootStackParams>
>;
export type SettingsBlockedUsersScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingsStackParams, 'BlockedUsers'>,
  NativeStackScreenProps<RootStackParams>
>;

// Bottom
export type BottomShareInitScreenProps = CompositeScreenProps<
  NativeStackScreenProps<BottomStackParams, 'ShareInit'>,
  NativeStackScreenProps<RootStackParams>
>;

// Main
export type MainNavigationProp = NativeStackNavigationProp<MainStackParams>;

export type ExploreScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Explore'>,
  NativeStackScreenProps<RootStackParams>
>;
export type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Profile'>,
  NativeStackScreenProps<RootStackParams>
>;
export type ShareScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Share'>,
  NativeStackScreenProps<RootStackParams>
>;
export type CommentsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Comments'>,
  NativeStackScreenProps<RootStackParams>
>;
export type ImageViewerScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'ImageViewer'>,
  NativeStackScreenProps<RootStackParams>
>;
export type SearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Search'>,
  NativeStackScreenProps<RootStackParams>
>;
export type NotificationsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Notifications'>,
  NativeStackScreenProps<RootStackParams>
>;
export type RelationsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Relations'>,
  NativeStackScreenProps<RootStackParams>
>;
export type ChatsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Chats'>,
  NativeStackScreenProps<RootStackParams>
>;
export type ChatScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Chat'>,
  NativeStackScreenProps<RootStackParams>
>;
