import {View} from 'react-native';
import {useTheme} from './Hooks';
import Providers from './Providers';
import Router from './Router';
import Env from './Utils/Env';
import {ThemedStyleSheet} from './Utils/ThemedStyleSheet';

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

  return (
    <View style={styles.container}>
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
