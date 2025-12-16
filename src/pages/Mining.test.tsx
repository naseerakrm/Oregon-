import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Mining from './Mining';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtocolProvider } from '../contexts/ProtocolContext';
import { MiningPool } from '../types';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
        const translations: {[key: string]: string} = {
            'mining.title': 'Mining',
            'mining.start': 'Start Mining',
            'common.messages.loading': 'Loading...',
            'mining.poolStats': 'Pool Statistics'
        };
        return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
  }),
}));

// Mock services
jest.mock('../services/protocol', () => ({
  protocolService: {
    getDnaProfile: jest.fn().mockResolvedValue({
        id: '1',
        traits: { resilience: 80, efficiency: 90, luck: 50 },
        lineage: []
    }),
    getMiningPools: jest.fn().mockResolvedValue([
        { id: '1', name: 'Test Pool', description: 'Test', hashRate: 100, miners: 10, rewardRate: 0.1, fee: 0.01, isActive: true }
    ] as MiningPool[]),
    getActiveSession: jest.fn().mockResolvedValue(null),
    getSecurityAlerts: jest.fn().mockResolvedValue([]),
    getProtocolState: jest.fn().mockResolvedValue(null),
    startMining: jest.fn().mockResolvedValue({}),
    stopMining: jest.fn().mockResolvedValue({}),
  }
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <ProtocolProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ProtocolProvider>
    </AuthProvider>
  );
};

test('renders mining page with pools', async () => {
  renderWithProviders(<Mining />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });

  expect(screen.getByText(/Mining/i)).toBeInTheDocument();
  expect(screen.getByText(/Test Pool/i)).toBeInTheDocument();
  expect(screen.getByText(/Start Mining/i)).toBeInTheDocument();
});
