import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Host as PortalizeProvider} from 'react-native-portalize';
import {PaperProvider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import {ToastContainer} from './Containers';
import {store, persistor} from './Redux';
import {CurrentTimeProvider, useTheme} from './Hooks';
import {LanguageProvider} from './Hooks/Language';
import {ThemeProvider} from './Hooks/Theming';
import {ToastProvider} from './Hooks/useToast';
import {DialogProvider} from './Hooks/useDialog';
import {PostUploaderProvider} from './Hooks/useUploadPost';
import {PaperIconProp} from './Utils/CommonComponents';

const queryClient = new QueryClient();

/**
 * RootProviders is the top-level provider for the app and should only contain
 * providers that must be at the top-level or providers that are used by other providers.
 */
const RootProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <LanguageProvider>
                <QueryClientProvider client={queryClient}>
                  <Providers>{children}</Providers>
                </QueryClientProvider>
              </LanguageProvider>
            </ThemeProvider>
          </PersistGate>
        </ReduxProvider>
      </SafeAreaProvider>
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
        icon: PaperIconProp,
      }}
      theme={theme.paper}
    >
      <PortalizeProvider>
        <ToastProvider>
          <ToastContainer>
            <DialogProvider>
              <CurrentTimeProvider>{children}</CurrentTimeProvider>
            </DialogProvider>
          </ToastContainer>
        </ToastProvider>
      </PortalizeProvider>
    </PaperProvider>
  );
};

/**
 * AfterLoadProviders is the third-level provider for the app and should contain
 * providers that are supposed to be loaded after the app has been initialized
 * and everything is ready to go.
 */
export const AfterLoadProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
  return <PostUploaderProvider>{children}</PostUploaderProvider>;
};

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});

export default RootProviders;
