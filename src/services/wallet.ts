import { 
  Wallet, 
  Transaction, 
  PriceData, 
  AnalyticsData 
} from '../types';
import { apiService } from './api';

class WalletService {
  async getWallet(userId: string): Promise<Wallet> {
    return apiService.get<Wallet>('/v1/wallet/me');
  }

  async getTransactions(userId: string, limit?: number): Promise<Transaction[]> {
    const url = limit ? `/v1/wallet/transactions?limit=${limit}` : '/v1/wallet/transactions';
    return apiService.get<Transaction[]>(url);
  }

  async getPriceData(): Promise<PriceData[]> {
    return apiService.get<PriceData[]>('/v1/market/prices');
  }

  async sendTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    return apiService.post<Transaction>('/v1/wallet/transaction', transactionData);
  }

  async getAnalyticsData(userId: string): Promise<AnalyticsData> {
    return apiService.get<AnalyticsData>('/v1/wallet/analytics');
  }
}

export const walletService = new WalletService();
