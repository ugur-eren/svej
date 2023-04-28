import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParams = {
  AuthStack: NavigatorScreenParams<AuthStackParams>;
};

export type AuthStackParams = {
  Login: undefined;
  Register: undefined;
};

// Auth
export type AuthLoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, 'Login'>,
  NativeStackScreenProps<RootStackParams>
>;
export type AuthRegisterScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, 'Register'>,
  NativeStackScreenProps<RootStackParams>
>;
