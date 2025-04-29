import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeTransaction = async (transaction) => {
  try {
    const existing = await AsyncStorage.getItem('transactions');
    const transactions = existing ? JSON.parse(existing) : [];
    transactions.unshift(transaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to store transaction', e);
  }
};

export const getTransactions = async () => {
  try {
    const existing = await AsyncStorage.getItem('transactions');
    return existing ? JSON.parse(existing) : [];
  } catch (e) {
    console.error('Failed to get transactions', e);
    return [];
  }
};

export const clearTransactions = async () => {
  try {
    await AsyncStorage.removeItem('transactions');
  } catch (e) {
    console.error('Failed to clear transactions', e);
  }
};

export const deleteTransaction = async (id) => {
  try {
    const existing = await AsyncStorage.getItem('transactions');
    const transactions = existing ? JSON.parse(existing) : [];
    const filtered = transactions.filter(t => t.id !== id);
    await AsyncStorage.setItem('transactions', JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete transaction', e);
  }
};
