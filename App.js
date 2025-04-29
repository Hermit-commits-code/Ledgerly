import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
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
import SavingsGoalsScreen from './src/screens/SavingsGoalsScreen';
import AdvancedReportsScreen from './src/screens/AdvancedReportsScreen';
import DataExportImportScreen from './src/screens/DataExportImportScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { processRecurringTransactions } from './src/utils/recurring';

const Stack = createNativeStackNavigator();

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    processRecurringTransactions();
  }, []);

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  const handleLogout = () => {
    setUnlocked(false);
  };

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
        <Stack.Screen name="Home">
          {props => (
            <HomeScreen
              {...props}
              onLogout={handleLogout}
              renderQuickLinks={() => (
                <View style={styles.quickLinksRow}>
                  <TouchableOpacity style={styles.quickLinkBtn} onPress={() => props.navigation.navigate('AdvancedReports')}>
                    <Text style={styles.quickLinkText}>Advanced Reports</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickLinkBtn} onPress={() => props.navigation.navigate('SavingsGoals')}>
                    <Text style={styles.quickLinkText}>Savings Goals</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickLinkBtn} onPress={() => props.navigation.navigate('DataExportImport')}>
                    <Text style={styles.quickLinkText}>Export/Import</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickLinkBtn} onPress={() => props.navigation.navigate('Settings')}>
                    <Text style={styles.quickLinkText}>Settings</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
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
        <Stack.Screen name="AdvancedReports" component={AdvancedReportsScreen} />
        <Stack.Screen name="SavingsGoals" component={SavingsGoalsScreen} />
        <Stack.Screen name="DataExportImport" component={DataExportImportScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
