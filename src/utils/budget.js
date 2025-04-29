import AsyncStorage from '@react-native-async-storage/async-storage';

const BUDGETS_KEY = 'budgets';

export const getBudgets = async () => {
  try {
    const existing = await AsyncStorage.getItem(BUDGETS_KEY);
    return existing ? JSON.parse(existing) : {};
  } catch (e) {
    console.error('Failed to get budgets', e);
    return {};
  }
};

export const setBudget = async (category, amount) => {
  try {
    const budgets = await getBudgets();
    budgets[category] = amount;
    await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (e) {
    console.error('Failed to set budget', e);
  }
};

export const removeBudget = async (category) => {
  try {
    const budgets = await getBudgets();
    delete budgets[category];
    await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (e) {
    console.error('Failed to remove budget', e);
  }
};
