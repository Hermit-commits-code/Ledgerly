import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, Platform, StatusBar, Image, TextInput } from 'react-native';
import { getTransactions, deleteTransaction } from '../utils/storage';
import { getCurrencySymbol } from './SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdvancedReportsScreen from './AdvancedReportsScreen';
import SettingsScreen from './SettingsScreen';
import BudgetScreen from './BudgetScreen';
import DataExportImportScreen from './DataExportImportScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

function HomeScreenContent({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTransactions();
    });
    loadTransactions();
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const txs = await getTransactions();
      setTransactions(txs);
      if (txs.length > 0 && txs[0].currency) setCurrency(txs[0].currency);
    })();
  }, []);

  const loadTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteTransaction(id);
        loadTransactions();
      }}
    ]);
  };

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter(t => {
    const q = search.toLowerCase();
    return (
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.attachment && t.attachment.type === 'note' && t.attachment.note.toLowerCase().includes(q))
    );
  });

  const renderTransactionAmount = (item) => {
    const isIncome = item.amount > 0;
    return (
      <Text style={[styles.transactionAmount, isIncome ? styles.income : styles.expense]}>
        {isIncome
          ? `+${getCurrencySymbol(item.currency || currency)}${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
          : `-${getCurrencySymbol(item.currency || currency)}${Math.abs(item.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.balanceLabel} accessibilityRole="header" accessibilityLabel="Total Balance">Total Balance</Text>
            <Text style={styles.balanceAmount} accessibilityLabel={`Total balance is ${getCurrencySymbol(currency)}${totalBalance.toFixed(2)}`}>{getCurrencySymbol(currency)}{totalBalance.toFixed(2)}</Text>
            <Text style={styles.sectionTitle} accessibilityRole="header" accessibilityLabel="Recent Transactions">Recent Transactions</Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Search by description, category, or note..."
              value={search}
              onChangeText={setSearch}
              accessibilityLabel="Search transactions"
              accessibilityHint="Search by description, category, or note"
            />
          </>
        }
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionRow} accessible accessibilityLabel={`Transaction at ${item.description}, amount ${item.amount > 0 ? 'plus' : 'minus'} ${getCurrencySymbol(currency)}${Math.abs(item.amount).toFixed(2)}, category ${item.category}, date ${item.date}`}> 
            <View>
              <Text style={styles.transactionDesc} accessibilityLabel={`Description: ${item.description}`}>{item.description}</Text>
              <Text style={styles.transactionAmount} accessibilityLabel={`Amount: ${item.amount > 0 ? '+' : '-'}${getCurrencySymbol(currency)}${Math.abs(item.amount).toFixed(2)}`}>{item.amount > 0 ? '+' : '-'}{getCurrencySymbol(currency)}{Math.abs(item.amount).toFixed(2)}</Text>
              <Text style={styles.transactionDate} accessibilityLabel={`Date: ${item.date}`}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)} accessibilityRole="button" accessibilityLabel={`Delete transaction at ${item.description}`}> 
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        accessibilityLabel="Transactions List"
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTransaction')} accessibilityRole="button" accessibilityLabel="Add Transaction">
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb', height: 60 },
        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
        tabBarItemStyle: { flex: 1, minWidth: 90, maxWidth: 140, marginHorizontal: 2, alignItems: 'center', justifyContent: 'center' },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreenContent} options={{
        tabBarLabel: 'Home',
        tabBarIcon: () => <Text accessibilityLabel="Home Tab Icon">🏠</Text>,
        accessibilityLabel: 'Home Tab',
        accessibilityRole: 'tab',
      }} />
      <Tab.Screen name="ReportsTab" component={AdvancedReportsScreen} options={{
        tabBarLabel: 'Reports',
        tabBarIcon: () => <Text accessibilityLabel="Reports Tab Icon">📊</Text>,
        accessibilityLabel: 'Reports Tab',
        accessibilityRole: 'tab',
      }} />
      <Tab.Screen name="BudgetsTab" component={BudgetScreen} options={{
        tabBarLabel: 'Budgets',
        tabBarIcon: () => <Text accessibilityLabel="Budgets Tab Icon">💰</Text>,
        accessibilityLabel: 'Budgets Tab',
        accessibilityRole: 'tab',
      }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{
        tabBarLabel: 'Settings',
        tabBarIcon: () => <Text accessibilityLabel="Settings Tab Icon">⚙️</Text>,
        accessibilityLabel: 'Settings Tab',
        accessibilityRole: 'tab',
      }} />
      <Tab.Screen name="DataExportImport" component={DataExportImportScreen} options={{ tabBarButton: () => null, tabBarVisible: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarButton: () => null, tabBarVisible: false }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 0,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  balanceLabel: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 16,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  transactionsList: {
    width: '100%',
    marginBottom: 24,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
  },
  transactionDesc: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
  },
  recurringIcon: {
    fontSize: 16,
    marginLeft: 4,
    color: '#38bdf8',
  },
  transactionAmount: { fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  income: { color: '#22c55e' }, // green
  expense: { color: '#ef4444' }, // red
  transactionDate: { fontSize: 12, color: '#64748b', marginLeft: 8, paddingRight: 8 },
  attachmentThumb: {
    width: 28,
    height: 28,
    borderRadius: 4,
    marginLeft: 6,
    marginRight: 2,
  },
  attachmentNoteIcon: {
    fontSize: 22,
    marginLeft: 6,
    marginRight: 2,
  },
  deleteBtn: {
    marginLeft: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#2b6cb0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  searchBar: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    color: '#334155',
  },
});

export { HomeScreenContent };
export default MainTabs;
