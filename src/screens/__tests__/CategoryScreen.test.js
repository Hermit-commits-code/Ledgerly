import React from 'react';
import { render } from '@testing-library/react-native';
import CategoryScreen from '../CategoryScreen';

describe('CategoryScreen', () => {
  it('renders title and empty state', () => {
    const { getByText } = render(<CategoryScreen onLogout={jest.fn()} categories={[]} />);
    expect(getByText('Categories')).toBeTruthy();
    expect(getByText('No categories found. Add your first category!')).toBeTruthy();
  });
});
