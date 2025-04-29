import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, Alert, Platform, StatusBar } from 'react-native';
import { getBudgets, setBudget, removeBudget } from '../utils/budget';
import { getTransactions } from '../utils/storage';

const CATEGORIES = [
  'Groceries',
  'Rent',
  'Utilities',
  'Dining',
  'Transport',
  'Health',
  'Entertainment',
  'Other',
];

export default function BudgetScreen({ onLogout }) {
  const [budgets, setBudgets] = useState({});
  const [spending, setSpending] = useState({});
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    loadBudgets();
    loadSpending();
  }, []);

  const loadBudgets = async () => {
    const data = await getBudgets();
    setBudgets(data);
  };

  const loadSpending = async () => {
    const txs = await getTransactions();
    const sums = {};
    txs.forEach(t => {
      if (!sums[t.category]) sums[t.category] = 0;
      sums[t.category] += Math.abs(t.amount);
    });
    setSpending(sums);
  };

  const handleSetBudget = async (cat) => {
    const val = parseFloat(inputs[cat]);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Invalid budget', 'Please enter a positive number.');
      return;
    }
    await setBudget(cat, val);
    setInputs({ ...inputs, [cat]: '' });
    loadBudgets();
  };

  const handleRemoveBudget = async (cat) => {
    await removeBudget(cat);
    loadBudgets();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleSpacer} />
        <Text style={styles.title}>Budgets</Text>
        <FlatList
          data={CATEGORIES}
          keyExtractor={cat => cat}
          renderItem={({ item: cat }) => {
            const spent = spending[cat] || 0;
            const budget = budgets[cat];
            const percent = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
            return (
              <View style={styles.categoryCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.catName}>{cat}</Text>
                  {budget ? (
                    <Text style={percent >= 100 ? styles.overBudget : percent >= 90 ? styles.nearBudget : styles.budgetText}>
                      ${spent.toFixed(2)} spent / ${budget} budget ({percent}%)
                    </Text>
                  ) : (
                    <Text style={styles.noBudget}>No budget set</Text>
                  )}
                  {budget && percent >= 100 && (
                    <Text style={styles.alertText}>⚠️ Over budget!</Text>
                  )}
                  {budget && percent >= 90 && percent < 100 && (
                    <Text style={styles.alertText}>⚠️ Near budget limit</Text>
                  )}
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Set budget"
                  value={inputs[cat] || ''}
                  onChangeText={val => setInputs({ ...inputs, [cat]: val })}
                  keyboardType="numeric"
                  blurOnSubmit={true}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.setBtn} onPress={() => handleSetBudget(cat)}>
                  <Text style={styles.setBtnText}>Set</Text>
                </TouchableOpacity>
                {budget && (
                  <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveBudget(cat)}>
                    <Text style={styles.removeBtnText}>X</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
          style={styles.flatList}
          showsVerticalScrollIndicator={true}
        />
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
    padding: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleSpacer: {
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 24,
    marginTop: 12,
    alignSelf: 'center',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  catName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  budgetText: {
    color: '#2b6cb0',
    fontSize: 15,
  },
  overBudget: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
  nearBudget: {
    color: '#fbbf24', // yellow
    fontWeight: 'bold',
  },
  noBudget: {
    color: '#64748b',
    fontSize: 15,
  },
  alertText: {
    color: '#ef4444',
    fontWeight: 'bold',
    marginTop: 2,
  },
  input: {
    width: 110,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  setBtn: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginRight: 4,
  },
  setBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  removeBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
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
  flatList: {
    flex: 1,
    width: '100%',
  },
});
