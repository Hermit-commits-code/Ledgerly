import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { getTransactions } from '../utils/storage';
import { PieChart } from 'react-native-chart-kit';

const COLORS = [
  '#2b6cb0', '#38bdf8', '#fbbf24', '#ef4444', '#10b981', '#6366f1', '#f472b6', '#64748b',
];

export default function ReportScreen({ onLogout }) {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const transactions = await getTransactions();
    const byCategory = {};
    transactions.forEach((t) => {
      if (!byCategory[t.category]) byCategory[t.category] = 0;
      byCategory[t.category] += Math.abs(t.amount);
    });
    const data = Object.keys(byCategory).map((cat, i) => ({
      name: cat,
      amount: byCategory[cat],
      color: COLORS[i % COLORS.length],
      legendFontColor: '#334155',
      legendFontSize: 15,
    }));
    setCategoryData(data);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleSpacer} />
        <Text style={styles.title}>Spending Report</Text>
        {categoryData.length > 0 ? (
          <PieChart
            data={categoryData.map(d => ({
              name: d.name,
              population: d.amount,
              color: d.color,
              legendFontColor: d.legendFontColor,
              legendFontSize: d.legendFontSize,
            }))}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(43, 108, 176, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="8"
            absolute
          />
        ) : (
          <Text style={styles.empty}>No transactions to report.</Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 0,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  titleSpacer: {
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 24,
  },
  empty: {
    color: '#64748b',
    fontSize: 16,
    marginTop: 32,
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
