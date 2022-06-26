import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import * as React from 'react';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import getStore from './store';

export default function App() {
  const colorScheme = useColorScheme();
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={getStore()}>
            <Navigation colorScheme={colorScheme} />
        </Provider>
      </SafeAreaProvider>
    );
  }
}


