import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeTransaction, getTransactions } from './storage';

const RECURRING_KEY = 'recurring_transactions';

export const getRecurringTransactions = async () => {
  try {
    const existing = await AsyncStorage.getItem(RECURRING_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (e) {
    console.error('Failed to get recurring transactions', e);
    return [];
  }
};

export const addRecurringTransaction = async (recurring) => {
  try {
    const existing = await getRecurringTransactions();
    existing.push(recurring);
    await AsyncStorage.setItem(RECURRING_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to add recurring transaction', e);
  }
};

export const removeRecurringTransaction = async (id) => {
  try {
    const existing = await getRecurringTransactions();
    const filtered = existing.filter(t => t.id !== id);
    await AsyncStorage.setItem(RECURRING_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to remove recurring transaction', e);
  }
};

// Call this on app launch to generate due recurring transactions
export const processRecurringTransactions = async () => {
  const now = Date.now();
  const recurs = await getRecurringTransactions();
  let updated = false;
  for (let r of recurs) {
    // If nextOccurrence is in the past, generate a transaction
    if (r.nextOccurrence && now >= r.nextOccurrence) {
      await storeTransaction({ ...r, id: Date.now().toString(), isRecurring: true });
      // Calculate next occurrence
      let next = new Date(r.nextOccurrence);
      switch (r.frequency) {
        case 'daily': next.setDate(next.getDate() + 1); break;
        case 'weekly': next.setDate(next.getDate() + 7); break;
        case 'monthly': next.setMonth(next.getMonth() + 1); break;
        case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
        default: break;
      }
      r.nextOccurrence = next.getTime();
      updated = true;
    }
  }
  if (updated) {
    await AsyncStorage.setItem(RECURRING_KEY, JSON.stringify(recurs));
  }
};
