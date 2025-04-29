import React from 'react';
import { render } from '@testing-library/react-native';
import LockScreen from '../LockScreen';

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
}));

describe('LockScreen', () => {
  it('renders title and subtitle', async () => {
    const { findByText } = render(<LockScreen navigation={{}} onUnlock={jest.fn()} />);
    expect(await findByText('Ledgerly Locked')).toBeTruthy();
    expect(await findByText('Authenticate to unlock Ledgerly')).toBeTruthy();
  });

  it('shows biometric button if supported', async () => {
    const { findByText } = render(<LockScreen navigation={{}} onUnlock={jest.fn()} />);
    expect(await findByText(/Unlock with Biometrics|Authenticating.../)).toBeTruthy();
  });
});
