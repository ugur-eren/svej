import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParams = {
  OnboardingStack: NavigatorScreenParams<OnboardingStackParams>;
};

export type OnboardingStackParams = {
  Landing: undefined;
};

// Onboarding
export type OnboardingLandingScreenProps = CompositeScreenProps<
  NativeStackScreenProps<OnboardingStackParams, 'Landing'>,
  NativeStackScreenProps<RootStackParams>
>;
