import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const CURRENCY_KEY = 'default_currency';
const BIOMETRIC_KEY = 'biometrics_enabled';
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [currency, setCurrency] = useState('USD');
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(CURRENCY_KEY);
      if (saved) setCurrency(saved);
      const bio = await AsyncStorage.getItem(BIOMETRIC_KEY);
      setBiometricsEnabled(bio === 'true');
    })();
  }, []);

  const saveCurrency = async (cur) => {
    setCurrency(cur);
    await AsyncStorage.setItem(CURRENCY_KEY, cur);
    Alert.alert('Currency updated', `Default currency set to ${cur}`);
  };

  const toggleBiometrics = async () => {
    const next = !biometricsEnabled;
    setBiometricsEnabled(next);
    await AsyncStorage.setItem(BIOMETRIC_KEY, next ? 'true' : 'false');
    Alert.alert('Biometric setting', `Biometric lock ${next ? 'enabled' : 'disabled'}.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, styles.titleAccent]} accessibilityRole="header" accessibilityLabel="Settings screen heading">Settings</Text>

        {/* Profile Section */}
        <Text style={styles.sectionHeader} accessibilityRole="header" accessibilityLabel="Profile section">Profile</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Profile')} accessibilityRole="button" accessibilityLabel="Account Info, edit your profile information">
          <Text style={styles.menuBtnText}>Account Info</Text>
        </TouchableOpacity>

        {/* Data Section */}
        <Text style={styles.sectionHeader} accessibilityRole="header" accessibilityLabel="Data section">Data & Backup</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('DataExportImport')} accessibilityRole="button" accessibilityLabel="Export or Import Data">
          <Text style={styles.menuBtnText}>Export / Import Data</Text>
        </TouchableOpacity>

        {/* Preferences Section */}
        <Text style={styles.sectionHeader} accessibilityRole="header" accessibilityLabel="Preferences section">Preferences</Text>
        <Text style={styles.label} accessibilityLabel="Default Currency">Default Currency</Text>
        <View style={styles.pickerWrapper} accessible accessibilityLabel="Currency Picker">
          <Picker
            selectedValue={currency}
            style={styles.picker}
            onValueChange={saveCurrency}
            accessibilityLabel="Currency selection"
            accessibilityHint="Select your default currency"
          >
            {CURRENCIES.map(cur => (
              <Picker.Item key={cur.code} label={`${cur.name} (${cur.code})`} value={cur.code} />
            ))}
          </Picker>
        </View>

        {/* Security Section */}
        <Text style={styles.sectionHeader} accessibilityRole="header" accessibilityLabel="Security section">Security</Text>
        <View style={styles.rowBetween} accessible accessibilityLabel="Biometric Lock">
          <Text style={styles.label} accessibilityLabel="Biometric Lock">Biometric Lock</Text>
          <Switch value={biometricsEnabled} onValueChange={toggleBiometrics} accessibilityRole="switch" accessibilityLabel="Toggle biometric lock" accessibilityState={{ checked: biometricsEnabled }} />
        </View>

        {/* About Section */}
        <Text style={styles.sectionHeader} accessibilityRole="header" accessibilityLabel="About section">About</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => Alert.alert('About', 'Ledgerly v1.0.0\nOpen source personal finance app.')} accessibilityRole="button" accessibilityLabel="App Info, about Ledgerly">
          <Text style={styles.menuBtnText}>App Info</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export async function getDefaultCurrency() {
  const saved = await AsyncStorage.getItem(CURRENCY_KEY);
  return saved || 'USD';
}

export function getCurrencySymbol(code) {
  const found = CURRENCIES.find(c => c.code === code);
  return found ? found.symbol : '$';
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, marginTop: 24,textAlign: 'center' },
  titleAccent: { fontSize: 28, fontWeight: 'bold', color: '#2563eb' },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#2563eb', marginTop: 20, marginBottom: 8 },
  label: { fontSize: 16, color: '#64748b', marginBottom: 8 },
  pickerWrapper: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 20 },
  picker: { height: 48, width: '100%' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  menuBtn: { backgroundColor: '#e0e7ef', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, marginBottom: 12 },
  menuBtnText: { color: '#2563eb', fontWeight: 'bold', fontSize: 16 },
});
