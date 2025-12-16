import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock services
jest.mock('./services/protocol', () => ({
  protocolService: {
    getDnaProfile: jest.fn().mockResolvedValue(null),
    getMiningPools: jest.fn().mockResolvedValue([]),
    getActiveSession: jest.fn().mockResolvedValue(null),
    getSecurityAlerts: jest.fn().mockResolvedValue([]),
    getProtocolState: jest.fn().mockResolvedValue(null),
  }
}));

jest.mock('./services/wallet', () => ({
  walletService: {
    getWallet: jest.fn().mockResolvedValue({}),
    getAnalyticsData: jest.fn().mockResolvedValue({}),
  }
}));

test('renders app without crashing', async () => {
  render(<App />);
  // Depending on the auth state, it might redirect to login
  // Let's just check if the app title or something global is rendered
  // "Orecoin" is in the title of Login and Dashboard
  const titleElements = await screen.findAllByText(/Orecoin/i);
  expect(titleElements.length).toBeGreaterThan(0);
});
