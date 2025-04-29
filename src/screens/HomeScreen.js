import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, Platform, StatusBar, Image, TextInput } from 'react-native';
import { getTransactions, deleteTransaction } from '../utils/storage';
import { getCurrencySymbol } from './SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdvancedReportsScreen from './AdvancedReportsScreen';
import SettingsScreen from './SettingsScreen';
import BudgetScreen from './BudgetScreen';

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
      <View style={styles.container}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{getCurrencySymbol(currency)}{totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by description, category, or note..."
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionRow}>
              <Text style={styles.transactionDesc}>{item.description}</Text>
              {item.isRecurring && (
                <Text style={styles.recurringIcon}>🔁</Text>
              )}
              {renderTransactionAmount(item)}
              <Text style={styles.transactionDate} numberOfLines={1} ellipsizeMode="tail">{item.date}</Text>
              {item.attachment && item.attachment.type === 'image' && (
                <Image source={{ uri: item.attachment.uri }} style={styles.attachmentThumb} />
              )}
              {item.attachment && item.attachment.type === 'note' && (
                <Text style={styles.attachmentNoteIcon}>📝</Text>
              )}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
                accessibilityLabel={`Delete ${item.description}`}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.transactionsList}
          ListEmptyComponent={<Text style={{color:'#64748b',textAlign:'center',marginTop:16}}>No transactions yet.</Text>}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTransaction')}>
          <Text style={styles.addButtonText}>+ Add Transaction</Text>
        </TouchableOpacity>
      </View>
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
        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreenContent} options={{ tabBarLabel: 'Home', tabBarIcon: () => <Text>🏠</Text> }} />
      <Tab.Screen name="ReportsTab" component={AdvancedReportsScreen} options={{ tabBarLabel: 'Reports', tabBarIcon: () => <Text>📊</Text> }} />
      <Tab.Screen name="BudgetsTab" component={BudgetScreen} options={{ tabBarLabel: 'Budgets', tabBarIcon: () => <Text>💰</Text> }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ tabBarLabel: 'Settings', tabBarIcon: () => <Text>⚙️</Text> }} />
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
