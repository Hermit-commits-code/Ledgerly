import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LockScreen({ navigation, onUnlock }) {
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricSupported(compatible && enrolled);
    })();
  }, []);

  const handleBiometricAuth = async () => {
    setAuthInProgress(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Ledgerly',
        fallbackLabel: 'Enter Passcode',
        disableDeviceFallback: false,
      });
      if (result.success) {
        onUnlock();
      } else if (result.error !== 'user_cancel') {
        Alert.alert('Authentication failed', 'Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'Biometric authentication failed.');
    } finally {
      setAuthInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ledgerly Locked</Text>
      <Text style={styles.subtitle}>Authenticate to continue</Text>
      {biometricSupported ? (
        <TouchableOpacity style={styles.unlockBtn} onPress={handleBiometricAuth} disabled={authInProgress}>
          <Text style={styles.unlockBtnText}>{authInProgress ? 'Authenticating...' : 'Unlock with Biometrics'}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.info}>Biometric authentication not available</Text>
      )}
      {/* Passcode fallback UI can be added here in the future */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 32,
  },
  unlockBtn: {
    backgroundColor: '#2b6cb0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  unlockBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  info: {
    color: '#64748b',
    fontSize: 16,
    marginTop: 16,
  },
});
