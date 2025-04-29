import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENCY_KEY = 'default_currency';
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
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(CURRENCY_KEY);
      if (saved) setCurrency(saved);
    })();
  }, []);

  const saveCurrency = async (cur) => {
    setCurrency(cur);
    await AsyncStorage.setItem(CURRENCY_KEY, cur);
    Alert.alert('Currency updated', `Default currency set to ${cur}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.label}>Default Currency</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={currency}
            style={styles.picker}
            onValueChange={saveCurrency}
          >
            {CURRENCIES.map(cur => (
              <Picker.Item key={cur.code} label={`${cur.name} (${cur.code})`} value={cur.code} />
            ))}
          </Picker>
        </View>
      </View>
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, color: '#64748b', marginBottom: 8 },
  pickerWrapper: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 20 },
  picker: { height: 48, width: '100%' },
});
