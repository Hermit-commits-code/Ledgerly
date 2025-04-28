import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
// App.js
import React from 'react';
import TabNavigator from './src/navigators/TabNavigator';

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
