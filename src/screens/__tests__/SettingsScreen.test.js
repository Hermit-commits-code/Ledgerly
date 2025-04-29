import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../SettingsScreen';

describe('SettingsScreen', () => {
  it('renders settings title and currency picker', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Default Currency')).toBeTruthy();
  });
});
