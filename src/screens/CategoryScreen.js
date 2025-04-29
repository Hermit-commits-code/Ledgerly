import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

export default function CategoryScreen({ onLogout, categories: injectedCategories }) {
  const categories = injectedCategories || [
    'Groceries',
    'Rent',
    'Utilities',
    'Dining',
    'Transport',
    'Health',
    'Entertainment',
    'Other',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Categories</Text>
        {categories.length === 0 ? (
          <Text style={styles.emptyState}>No categories found. Add your first category!</Text>
        ) : (
          categories.map((cat, idx) => (
            <TouchableOpacity
              key={cat}
              style={styles.categoryRow}
              activeOpacity={0.7}
              onPress={() => {}} // Placeholder for future edit/view
            >
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))
        )}
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
  emptyState: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 40,
    fontSize: 16,
  },
  categoryRow: {
    paddingVertical: 16,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
    elevation: 1,
  },
  categoryText: {
    fontSize: 18,
    color: '#334155',
    paddingLeft: 8,
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
