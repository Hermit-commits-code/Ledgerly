import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'savings_goals';

export default function SavingsGoalsScreen() {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setGoals(raw ? JSON.parse(raw) : []);
    })();
  }, []);

  const saveGoals = async (g) => {
    setGoals(g);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(g));
  };

  const addGoal = async () => {
    if (!name || !target || isNaN(Number(target))) {
      Alert.alert('Invalid input', 'Please enter a name and a numeric target.');
      return;
    }
    const newGoal = { id: Date.now().toString(), name, target: Number(target), saved: Number(saved) || 0 };
    await saveGoals([newGoal, ...goals]);
    setName(''); setTarget(''); setSaved('');
  };

  const updateSaved = async (id, amount) => {
    const g = goals.map(goal => goal.id === id ? { ...goal, saved: amount } : goal);
    await saveGoals(g);
  };

  const removeGoal = async (id) => {
    await saveGoals(goals.filter(g => g.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Savings Goals</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Goal Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Target Amount"
            value={target}
            onChangeText={setTarget}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Saved So Far"
            value={saved}
            onChangeText={setSaved}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addGoal}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={goals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.goalCard}>
              <Text style={styles.goalName}>{item.name}</Text>
              <Text style={styles.goalProgress}>${item.saved} / ${item.target}</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBar, { width: `${Math.min(100, (item.saved / item.target) * 100)}%` }]} />
              </View>
              <TextInput
                style={styles.savedInput}
                value={item.saved.toString()}
                onChangeText={val => updateSaved(item.id, Number(val) || 0)}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeGoal(item.id)}>
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No savings goals yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 8, marginRight: 8, marginBottom: 8, width: 110, borderWidth: 1, borderColor: '#e5e7eb' },
  addBtn: { backgroundColor: '#38bdf8', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  goalCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  goalName: { fontSize: 18, fontWeight: 'bold' },
  goalProgress: { fontSize: 15, marginVertical: 4 },
  progressBarBg: { height: 10, backgroundColor: '#e5e7eb', borderRadius: 5, marginVertical: 6 },
  progressBar: { height: 10, backgroundColor: '#38bdf8', borderRadius: 5 },
  savedInput: { backgroundColor: '#f1f5f9', borderRadius: 6, padding: 6, marginTop: 6, width: 90, borderWidth: 1, borderColor: '#e5e7eb' },
  removeBtn: { marginTop: 8, backgroundColor: '#ef4444', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-end' },
  removeBtnText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 40 },
});
