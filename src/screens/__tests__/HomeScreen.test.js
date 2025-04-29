import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreenContent } from '../HomeScreen';

jest.mock('../../utils/storage', () => ({
  getTransactions: jest.fn(() => Promise.resolve([
    { id: '1', description: 'Groceries', amount: -50, date: '04/27/2025', category: 'Groceries' },
    { id: '2', description: 'Salary', amount: 2500, date: '04/25/2025', category: 'Income' },
  ])),
  deleteTransaction: jest.fn(),
}));

jest.mock('../SettingsScreen', () => ({
  getCurrencySymbol: () => '$',
}));

describe('HomeScreenContent', () => {
  it('renders balance, search bar, and transactions', async () => {
    const { findByText, getByPlaceholderText } = render(<HomeScreenContent navigation={{ navigate: jest.fn(), addListener: jest.fn() }} />);

    expect(getByPlaceholderText('Search by description, category, or note...')).toBeTruthy();
    // Wait for transactions to load
    expect(await findByText('Groceries')).toBeTruthy();
    expect(await findByText('Salary')).toBeTruthy();
    expect(await findByText('$2,450.00')).toBeTruthy(); // 2500 - 50
  });

  it('filters transactions by search', async () => {
    const { getByPlaceholderText, findByText, queryByText } = render(<HomeScreenContent navigation={{ navigate: jest.fn(), addListener: jest.fn() }} />);
    const searchInput = getByPlaceholderText('Search by description, category, or note...');
    fireEvent.changeText(searchInput, 'Groceries');
    expect(await findByText('Groceries')).toBeTruthy();
    expect(queryByText('Salary')).toBeNull();
  });
});
