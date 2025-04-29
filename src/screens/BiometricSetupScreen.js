import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';

export default function BiometricSetupScreen({ navigation }) {
  const handleSetup = () => {
    // TODO: Implement biometric setup logic
    Alert.alert('Success', 'Biometric authentication set up!');
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Set Up Biometric Authentication</Text>
        <Text style={styles.description}>Use Face ID or fingerprint for extra security.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSetup}>
          <Text style={styles.primaryBtnText}>Enable Biometric</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.replace('Home')}>
          <Text style={styles.secondaryBtnText}>Skip for now</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 32,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: '#2b6cb0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
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
    alignItems: 'center',
    width: '100%',
  },
  secondaryBtnText: {
    color: '#2b6cb0',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
