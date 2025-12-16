import { apiService } from './api';
import { 
  DnaProfile, 
  MiningPool, 
  MiningSession, 
  SecurityAlert, 
  ProtocolState,
  MiningMode,
  DeviceType
} from '../types';

class ProtocolService {
  async getDnaProfile(): Promise<DnaProfile> {
    return apiService.get<DnaProfile>('/v1/dna/profile');
  }

  async getMiningPools(): Promise<MiningPool[]> {
    return apiService.get<MiningPool[]>('/v1/mining/pools');
  }

  async getActiveSession(): Promise<MiningSession | null> {
    try {
      return await apiService.get<MiningSession>('/v1/mining/session/active');
    } catch (error) {
      // If 404, it might mean no active session
      return null;
    }
  }

  async startMining(poolId: string, mode: MiningMode, deviceType: DeviceType): Promise<MiningSession> {
    return apiService.post<MiningSession>('/v1/mining/start', { poolId, mode, deviceType });
  }

  async stopMining(sessionId: string): Promise<void> {
    return apiService.post<void>('/v1/mining/stop', { sessionId });
  }

  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    return apiService.get<SecurityAlert[]>('/v1/security/alerts');
  }

  async getProtocolState(): Promise<ProtocolState> {
    return apiService.get<ProtocolState>('/v1/protocol/state');
  }
}

export const protocolService = new ProtocolService();
