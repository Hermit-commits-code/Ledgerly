import React from 'react';
import { render } from '@testing-library/react-native';
import BudgetScreen from '../BudgetScreen';

jest.mock('../../utils/budget', () => ({
  getBudgets: jest.fn(() => Promise.resolve({ Groceries: 200 })),
  setBudget: jest.fn(),
  removeBudget: jest.fn(),
}));

jest.mock('../../utils/storage', () => ({
  getTransactions: jest.fn(() => Promise.resolve([
    { id: '1', category: 'Groceries', amount: -50 },
    { id: '2', category: 'Groceries', amount: -30 },
  ])),
}));

describe('BudgetScreen', () => {
  it('renders budget categories and amounts', async () => {
    const { findByText } = render(<BudgetScreen onLogout={jest.fn()} CATEGORIES={['Groceries']} />);
    expect(await findByText('Groceries')).toBeTruthy();
    // Match $200 in the budget text, even if it's not standalone
    expect(await findByText(/\$200/)).toBeTruthy();
  });
});
