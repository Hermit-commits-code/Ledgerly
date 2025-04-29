import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>Ledgerly</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.replace('SignUp')}>
          <Text style={styles.primaryBtnText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.replace('SignIn')}>
          <Text style={styles.secondaryBtnText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.biometricBtn} onPress={() => navigation.replace('BiometricSetup')}>
          <Text style={styles.biometricBtnText}>Set Up Biometric (Optional)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: '#2b6cb0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2b6cb0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#2b6cb0',
    fontWeight: 'bold',
    fontSize: 18,
  },
  biometricBtn: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  biometricBtnText: {
    color: '#475569',
    fontSize: 16,
  },
});
