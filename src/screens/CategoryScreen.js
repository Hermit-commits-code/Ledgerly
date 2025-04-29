import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

const categories = [
  'Groceries',
  'Rent',
  'Utilities',
  'Dining',
  'Transport',
  'Health',
  'Entertainment',
  'Other',
];

export default function CategoryScreen({ onLogout }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <View style={styles.categoryRow}>
              <Text style={styles.categoryText}>{item}</Text>
            </View>
          )}
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
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 24,
    alignSelf: 'center',
  },
  categoryRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryText: {
    fontSize: 18,
    color: '#334155',
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
