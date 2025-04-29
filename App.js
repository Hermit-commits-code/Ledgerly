import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './src/components/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import TransactionFormScreen from './src/screens/TransactionFormScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import BiometricSetupScreen from './src/screens/BiometricSetupScreen';
import ReportScreen from './src/screens/ReportScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import LockScreen from './src/screens/LockScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  const handleLogout = () => {
    setUnlocked(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
        <Stack.Screen name="Home">
          {props => <HomeScreen {...props} onLogout={handleLogout} />}
        </Stack.Screen>
        <Stack.Screen name="AddTransaction">
          {props => <TransactionFormScreen {...props} onLogout={handleLogout} />}
        </Stack.Screen>
        <Stack.Screen name="Categories">
          {props => <CategoryScreen {...props} onLogout={handleLogout} />}
        </Stack.Screen>
        <Stack.Screen name="Budget">
          {props => <BudgetScreen {...props} onLogout={handleLogout} />}
        </Stack.Screen>
        <Stack.Screen name="Report">
          {props => <ReportScreen {...props} onLogout={handleLogout} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
