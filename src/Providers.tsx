import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Host as PortalizeProvider} from 'react-native-portalize';
import {StyleSheet} from 'react-native';

const Providers: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <SafeAreaProvider>
        <PortalizeProvider>{children}</PortalizeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});

export default Providers;
