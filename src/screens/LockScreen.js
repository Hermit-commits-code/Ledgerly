import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Ledgerly Locked</Text>
        <Text style={styles.subtitle}>Authenticate to unlock Ledgerly</Text>
        {biometricSupported ? (
          <TouchableOpacity style={styles.unlockBtn} onPress={handleBiometricAuth} disabled={authInProgress}>
            <Text style={styles.unlockBtnText}>{authInProgress ? 'Authenticating...' : 'Unlock with Biometrics'}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.info}>Biometric authentication not available</Text>
        )}
        {/* Passcode fallback UI can be added here in the future */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#2563eb' },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 32 },
  unlockBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 32 },
  unlockBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  info: {
    color: '#64748b',
    fontSize: 16,
    marginTop: 16,
  },
});
