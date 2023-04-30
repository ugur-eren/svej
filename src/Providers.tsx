import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Host as PortalizeProvider} from 'react-native-portalize';
import {Provider as PaperProvider} from 'react-native-paper';
import {Feather} from '@expo/vector-icons';
import {StyleSheet} from 'react-native';
import {useTheme} from './Hooks';
import {LanguageProvider} from './Hooks/Language';
import {ThemeProvider} from './Hooks/Theming';

/**
 * RootProviders is the top-level provider for the app and should only contain
 * providers that must be at the top-level or providers that are used by other providers.
 */
const RootProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <ThemeProvider>
        <LanguageProvider>
          <Providers>{children}</Providers>
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

/**
 * Providers is the second-level provider for the app and should contain
 * every other providers that does not fit in RootProviders.
 */
const Providers: React.FC<{children: React.ReactNode}> = ({children}) => {
  const theme = useTheme();

  return (
    <PaperProvider
      settings={{
        // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-explicit-any
        icon: (props: any) => <Feather {...props} />,
      }}
      theme={theme.paper}
    >
      <SafeAreaProvider>
        <PortalizeProvider>{children}</PortalizeProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});

export default RootProviders;
