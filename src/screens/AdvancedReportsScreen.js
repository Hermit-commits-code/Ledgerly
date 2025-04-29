import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { getTransactions } from '../utils/storage';
import { getCurrencySymbol } from './SettingsScreen';

function sumBy(transactions, filterFn) {
  return transactions.filter(filterFn).reduce((sum, t) => sum + t.amount, 0);
}

export default function AdvancedReportsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [netWorth, setNetWorth] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    (async () => {
      const txs = await getTransactions();
      const curr = await getCurrencySymbol();
      setTransactions(txs);
      setIncome(sumBy(txs, t => t.amount > 0));
      setExpense(sumBy(txs, t => t.amount < 0));
      setNetWorth(sumBy(txs, t => true));
      setCurrency(curr);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Advanced Reports</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Total Income</Text>
          <Text style={styles.valueIncome}>{getCurrencySymbol(currency)}{income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Total Expense</Text>
          <Text style={styles.valueExpense}>{getCurrencySymbol(currency)}{Math.abs(expense).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Net Worth</Text>
          <Text style={styles.valueNet}>{getCurrencySymbol(currency)}{netWorth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
        </View>
        <Text style={styles.subtitle}>Income vs. Expense (last 12 months)</Text>
        {/* Optionally, add a simple list or chart here */}
        <FlatList
          data={groupByMonth(transactions)}
          keyExtractor={item => item.month}
          renderItem={({ item }) => (
            <View style={styles.monthRow}>
              <Text style={styles.monthLabel}>{item.month}</Text>
              <Text style={styles.monthIncome}>{getCurrencySymbol(currency)}{item.income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
              <Text style={styles.monthExpense}>{getCurrencySymbol(currency)}{Math.abs(item.expense).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

function groupByMonth(transactions) {
  const months = {};
  transactions.forEach(t => {
    const [month, day, year] = t.date.split('/');
    const key = `${year}-${month.padStart(2, '0')}`;
    if (!months[key]) months[key] = { month: key, income: 0, expense: 0 };
    if (t.amount > 0) months[key].income += t.amount;
    else months[key].expense += t.amount;
  });
  return Object.values(months).sort((a, b) => b.month.localeCompare(a.month));
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 0 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#2563eb', textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 16, color: '#64748b' },
  valueIncome: { fontSize: 20, color: '#22c55e', fontWeight: 'bold' },
  valueExpense: { fontSize: 20, color: '#ef4444', fontWeight: 'bold' },
  valueNet: { fontSize: 20, color: '#334155', fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 6, textAlign: 'center', color: '#334155' },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8, alignItems: 'center' },
  monthLabel: { fontWeight: 'bold', fontSize: 15, width: 90 },
  monthIncome: { color: '#22c55e', fontWeight: 'bold', fontSize: 15 },
  monthExpense: { color: '#ef4444', fontWeight: 'bold', fontSize: 15 },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 40 },
});
