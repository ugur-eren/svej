import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParams, OnboardingStackParams} from './Typings/NavigationTypes';

import Landing from './Screens/Landing/Landing';

const RootStack = createNativeStackNavigator<RootStackParams>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParams>();

const OnboardingStackNavigator = () => {
  return (
    <OnboardingStack.Navigator initialRouteName="Landing" screenOptions={{headerShown: false}}>
      <OnboardingStack.Screen name="Landing" component={Landing} />
    </OnboardingStack.Navigator>
  );
};

const Router: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="OnboardingStack" screenOptions={{headerShown: false}}>
        <RootStack.Screen name="OnboardingStack" component={OnboardingStackNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
