import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { getTransactions, deleteTransaction } from '../utils/storage';

export default function HomeScreen({ navigation, onLogout }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTransactions();
    });
    loadTransactions();
    return unsubscribe;
  }, [navigation]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionRow}>
              <Text style={styles.transactionDesc}>{item.description}</Text>
              <Text style={styles.transactionAmount}>
                {item.amount < 0
                  ? `-$${Math.abs(item.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                  : `+$${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
              </Text>
              <Text style={styles.transactionDate} numberOfLines={1} ellipsizeMode="tail">{item.date}</Text>
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
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.secondaryButtonText}>View Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportButton} onPress={() => navigation.navigate('Report')}>
          <Text style={styles.reportButtonText}>View Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.budgetButton} onPress={() => navigation.navigate('Budget')}>
          <Text style={styles.budgetButtonText}>View Budgets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  transactionAmount: {
    fontSize: 16,
    color: '#ef4444',
    width: 90,
    textAlign: 'right',
  },
  transactionDate: {
    fontSize: 14,
    color: '#64748b',
    width: 90,
    textAlign: 'right',
    flexShrink: 0,
    marginLeft: 8,
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
  secondaryButton: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2b6cb0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#2b6cb0',
    fontWeight: 'bold',
    fontSize: 18,
  },
  reportButton: {
    marginTop: 12,
    backgroundColor: '#38bdf8',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  reportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  budgetButton: {
    marginTop: 12,
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  budgetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
