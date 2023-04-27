import {View} from 'react-native';
import {useTheme} from './Hooks';
import Providers from './Providers';
import Router from './Router';
import {ThemedStyleSheet} from './Utils/ThemedStyleSheet';

function App() {
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
