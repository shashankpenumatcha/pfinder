import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import * as React from 'react';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import getStore from './store';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { default as mapping } from './mapping.json'
export default function App() {
  const colorScheme = useColorScheme();
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApplicationProvider customMapping={mapping as any} {...eva} theme={eva.light}>
        <SafeAreaProvider>
          <Provider store={getStore()}>
              <Navigation colorScheme={colorScheme} />
          </Provider>
        </SafeAreaProvider>
      </ApplicationProvider>
    );
  }
}


