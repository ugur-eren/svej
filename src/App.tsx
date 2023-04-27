import {useCallback} from 'react';
import {View} from 'react-native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useTheme} from './Hooks';
import Providers from './Providers';
import Router from './Router';
import Env from './Utils/Env';
import {ThemedStyleSheet} from './Utils/ThemedStyleSheet';

SplashScreen.preventAutoHideAsync();

function App() {
  if (!Env.USE_CONFIG || Env.USE_CONFIG !== 'true') {
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

const AppContent: React.FC = () => {
  const theme = useTheme();

  const styles = getStyles(theme);

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

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Router />
    </View>
  );
};

const getStyles = ThemedStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default App;
