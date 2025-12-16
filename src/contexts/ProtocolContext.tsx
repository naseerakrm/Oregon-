import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  DnaProfile, 
  MiningPool, 
  MiningSession, 
  SecurityAlert, 
  ProtocolState,
  MiningMode,
  DeviceType
} from '../types';
import { protocolService } from '../services/protocol';
import { useAuth } from './AuthContext';

interface ProtocolContextType {
  dnaProfile: DnaProfile | null;
  miningPools: MiningPool[];
  activeSession: MiningSession | null;
  securityAlerts: SecurityAlert[];
  protocolState: ProtocolState | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  startMining: (poolId: string, mode: MiningMode, deviceType: DeviceType) => Promise<void>;
  stopMining: () => Promise<void>;
}

const ProtocolContext = createContext<ProtocolContextType | undefined>(undefined);

export const ProtocolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [dnaProfile, setDnaProfile] = useState<DnaProfile | null>(null);
  const [miningPools, setMiningPools] = useState<MiningPool[]>([]);
  const [activeSession, setActiveSession] = useState<MiningSession | null>(null);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [protocolState, setProtocolState] = useState<ProtocolState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const [
        profileData,
        poolsData,
        sessionData,
        alertsData,
        stateData
      ] = await Promise.all([
        protocolService.getDnaProfile().catch(() => null), // Allow failure if profile doesn't exist yet
        protocolService.getMiningPools(),
        protocolService.getActiveSession(),
        protocolService.getSecurityAlerts(),
        protocolService.getProtocolState()
      ]);

      setDnaProfile(profileData);
      setMiningPools(poolsData);
      setActiveSession(sessionData);
      setSecurityAlerts(alertsData);
      setProtocolState(stateData);
    } catch (err: any) {
      console.error('Error fetching protocol data:', err);
      setError(err.message || 'Failed to load protocol data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startMining = async (poolId: string, mode: MiningMode, deviceType: DeviceType) => {
    try {
      const session = await protocolService.startMining(poolId, mode, deviceType);
      setActiveSession(session);
      // Refresh pools to update miner counts etc if needed
      const pools = await protocolService.getMiningPools();
      setMiningPools(pools);
    } catch (err: any) {
      throw err;
    }
  };

  const stopMining = async () => {
    if (!activeSession) return;
    try {
      await protocolService.stopMining(activeSession.id);
      setActiveSession(null);
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <ProtocolContext.Provider value={{
      dnaProfile,
      miningPools,
      activeSession,
      securityAlerts,
      protocolState,
      isLoading,
      error,
      refresh: fetchData,
      startMining,
      stopMining
    }}>
      {children}
    </ProtocolContext.Provider>
  );
};

export const useProtocol = () => {
  const context = useContext(ProtocolContext);
  if (context === undefined) {
    throw new Error('useProtocol must be used within a ProtocolProvider');
  }
  return context;
};
