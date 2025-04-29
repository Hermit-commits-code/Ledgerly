import React from 'react';
import { render } from '@testing-library/react-native';
import AdvancedReportsScreen from '../AdvancedReportsScreen';

jest.mock('../../utils/storage', () => ({
  getTransactions: jest.fn(() => Promise.resolve([
    { id: '1', amount: 1000, date: '04/01/2025', category: 'Income' },
    { id: '2', amount: -400, date: '04/02/2025', category: 'Groceries' },
  ])),
}));

jest.mock('../SettingsScreen', () => ({
  getCurrencySymbol: () => '$',
}));

describe('AdvancedReportsScreen', () => {
  it('renders total income, expense, and net worth', async () => {
    const { findAllByText } = render(<AdvancedReportsScreen />);
    // Use findAllByText and check that at least one match exists for each value
    expect((await findAllByText(/\$1,000/)).length).toBeGreaterThan(0);
    expect((await findAllByText(/\$400/)).length).toBeGreaterThan(0);
    expect((await findAllByText(/\$600/)).length).toBeGreaterThan(0); // net worth
  });
});
