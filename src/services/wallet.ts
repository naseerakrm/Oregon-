import { 
  Wallet, 
  Transaction, 
  MiningSession, 
  MiningPool, 
  PriceData, 
  Currency, 
  TransactionType, 
  TransactionStatus,
  AnalyticsData 
} from '../types';

class WalletService {
  // Mock wallet data
  private mockWallet: Wallet = {
    id: 'wallet-1',
    userId: '1',
    address: '0x1234567890123456789012345678901234567890',
    balance: 1250.75,
    currency: Currency.ORE,
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
  };

  // Mock transactions
  private mockTransactions: Transaction[] = [
    {
      id: 'tx-1',
      userId: '1',
      walletId: 'wallet-1',
      type: TransactionType.MINING,
      amount: 25.5,
      currency: Currency.ORE,
      status: TransactionStatus.CONFIRMED,
      description: 'Mining reward from pool Alpha',
      fee: 0.1,
      createdAt: new Date('2024-12-11'),
      updatedAt: new Date('2024-12-11'),
    },
    {
      id: 'tx-2',
      userId: '1',
      walletId: 'wallet-1',
      type: TransactionType.RECEIVE,
      amount: 100.0,
      currency: Currency.ORE,
      status: TransactionStatus.CONFIRMED,
      senderAddress: '0x9876543210987654321098765432109876543210',
      description: 'Payment for services',
      fee: 0.05,
      createdAt: new Date('2024-12-10'),
      updatedAt: new Date('2024-12-10'),
    },
    {
      id: 'tx-3',
      userId: '1',
      walletId: 'wallet-1',
      type: TransactionType.SEND,
      amount: -15.25,
      currency: Currency.ORE,
      status: TransactionStatus.CONFIRMED,
      recipientAddress: '0x5555555555555555555555555555555555555555',
      description: 'Transfer to exchange',
      fee: 0.08,
      createdAt: new Date('2024-12-09'),
      updatedAt: new Date('2024-12-09'),
    },
  ];

  // Mock mining pools
  private mockMiningPools: MiningPool[] = [
    {
      id: 'pool-1',
      name: 'Alpha Mining Pool',
      description: 'High-performance mining pool with low fees',
      hashRate: 1250000000,
      miners: 15420,
      rewardRate: 0.95,
      fee: 0.02,
      isActive: true,
    },
    {
      id: 'pool-2',
      name: 'Beta Mining Pool',
      description: 'Reliable and stable mining pool',
      hashRate: 890000000,
      miners: 8900,
      rewardRate: 0.92,
      fee: 0.025,
      isActive: true,
    },
  ];

  // Mock mining sessions
  private mockMiningSessions: MiningSession[] = [
    {
      id: 'mining-1',
      userId: '1',
      poolId: 'pool-1',
      startTime: new Date('2024-12-08'),
      totalHashes: 500000000,
      reward: 15.75,
      status: 'active' as any,
    },
  ];

  // Mock price data
  private mockPriceData: PriceData[] = [
    {
      currency: Currency.ORE,
      price: 2.45,
      change24h: 0.15,
      changePercent24h: 6.52,
      volume: 15000000,
      marketCap: 245000000,
      lastUpdated: new Date(),
    },
    {
      currency: Currency.BTC,
      price: 67500.00,
      change24h: -1250.00,
      changePercent24h: -1.82,
      volume: 15000000000,
      marketCap: 1330000000000,
      lastUpdated: new Date(),
    },
    {
      currency: Currency.ETH,
      price: 3850.00,
      change24h: 45.00,
      changePercent24h: 1.18,
      volume: 8500000000,
      marketCap: 463000000000,
      lastUpdated: new Date(),
    },
  ];

  async getWallet(userId: string): Promise<Wallet> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...this.mockWallet };
  }

  async getTransactions(userId: string, limit?: number): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const transactions = this.mockTransactions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return limit ? transactions.slice(0, limit) : transactions;
  }

  async getMiningPools(): Promise<MiningPool[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.mockMiningPools.filter(pool => pool.isActive);
  }

  async getMiningSessions(userId: string): Promise<MiningSession[]> {
    await new Promise(resolve => setTimeout(resolve, 350));
    return this.mockMiningSessions;
  }

  async startMining(userId: string, poolId: string): Promise<MiningSession> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newSession: MiningSession = {
      id: `mining-${Date.now()}`,
      userId,
      poolId,
      startTime: new Date(),
      totalHashes: 0,
      reward: 0,
      status: 'active' as any,
    };
    
    this.mockMiningSessions.push(newSession);
    return newSession;
  }

  async stopMining(sessionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sessionIndex = this.mockMiningSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
      this.mockMiningSessions[sessionIndex].status = 'completed' as any;
      this.mockMiningSessions[sessionIndex].endTime = new Date();
    }
  }

  async getPriceData(): Promise<PriceData[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockPriceData;
  }

  async sendTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      userId: transactionData.userId!,
      walletId: transactionData.walletId!,
      type: transactionData.type!,
      amount: transactionData.amount!,
      currency: transactionData.currency!,
      status: TransactionStatus.PENDING,
      recipientAddress: transactionData.recipientAddress,
      senderAddress: transactionData.senderAddress,
      description: transactionData.description,
      fee: transactionData.fee || 0.1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.mockTransactions.unshift(newTransaction);
    return newTransaction;
  }

  async getAnalyticsData(userId: string): Promise<AnalyticsData> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      totalBalance: 1250.75,
      totalTransactions: 45,
      miningRewards: 342.50,
      portfolioValue: 1250.75,
      performance24h: 6.52,
      performance7d: 12.30,
      performance30d: -5.25,
    };
  }
}

export const walletService = new WalletService();