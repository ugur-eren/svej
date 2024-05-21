import {memo, useCallback} from 'react';
import {View, Platform} from 'react-native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as StatusBar from 'expo-status-bar';
import {useInitializeApp, useTheme} from './Hooks';
import Providers, {AfterLoadProviders} from './Providers';
import Router from './Router';
import Env from './Utils/Env';
import {IsAndroid} from './Utils/Helpers';
import {ThemedStyleSheet} from './Utils/ThemedStyleSheet';
import {WEB_MAX_WIDTH} from './Utils/Constants';

SplashScreen.preventAutoHideAsync();

if (IsAndroid) StatusBar.setStatusBarTranslucent(false);

function App() {
  if (!Env.SVEJ_PUBLIC_USE_CONFIG || Env.SVEJ_PUBLIC_USE_CONFIG !== 'true') {
    throw new Error(
      'You need to fill in the .env file for the designated build environment. You can find the sample in .env.sample file',
    );
  }

  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

const AppContent = memo(() => {
  const theme = useTheme();

  const styles = getStyles(theme);

  const initialized = useInitializeApp();

  const [fontsLoaded] = useFonts({
    'FiraSans-Regular': require('./Assets/Fonts/FiraSans/FiraSans-Regular.ttf'),
    'FiraSans-Medium': require('./Assets/Fonts/FiraSans/FiraSans-Medium.ttf'),
    'FiraSans-SemiBold': require('./Assets/Fonts/FiraSans/FiraSans-SemiBold.ttf'),
    'FiraSans-Bold': require('./Assets/Fonts/FiraSans/FiraSans-Bold.ttf'),

    'EarWorm-Demo': require('./Assets/Fonts/EarWorm/EarWorm-Demo.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded || !initialized) return null;

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.content}>
        <AfterLoadProviders>
          <Router />
        </AfterLoadProviders>
      </View>
    </View>
  );
});

const getStyles = ThemedStyleSheet((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? WEB_MAX_WIDTH : '100%',
  },
}));

export default App;
