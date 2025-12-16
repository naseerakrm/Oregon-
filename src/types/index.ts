// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  walletAddress?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
}

// Wallet and Transaction Types
export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: number;
  currency: Currency;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  recipientAddress?: string;
  senderAddress?: string;
  transactionHash?: string;
  description?: string;
  fee: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionType {
  SEND = 'send',
  RECEIVE = 'receive',
  MINING = 'mining',
  EXCHANGE = 'exchange',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum Currency {
  ORE = 'ORE',
  USD = 'USD',
  ETH = 'ETH',
  BTC = 'BTC',
}

// Mining Types
export interface MiningPool {
  id: string;
  name: string;
  description: string;
  hashRate: number;
  miners: number;
  rewardRate: number;
  fee: number;
  isActive: boolean;
}

export interface MiningSession {
  id: string;
  userId: string;
  poolId: string;
  startTime: Date;
  endTime?: Date;
  totalHashes: number;
  reward: number;
  status: MiningStatus;
}

export enum MiningStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  FAILED = 'failed',
}

export enum MiningMode {
  SOLO = 'solo',
  POOL = 'pool',
}

export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  RIG = 'rig',
}

export interface DnaProfile {
  id: string;
  userId: string;
  fingerprint: string;
  traits: {
    resilience: number;
    efficiency: number;
    luck: number;
  };
  lineage: DnaLineage[];
  createdAt: Date;
}

export interface DnaLineage {
  generation: number;
  ancestorId: string;
  contribution: number;
}

export interface SecurityAlert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface ProtocolState {
  globalHashRate: number;
  activeMiners: number;
  currentBlock: number;
  nextHalving: Date;
  difficulty: number;
}

// Market and Price Types
export interface PriceData {
  currency: Currency;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface MarketData {
  prices: PriceData[];
  trending: Currency[];
  topMovers: {
    gainers: { currency: Currency; change: number }[];
    losers: { currency: Currency; change: number }[];
  };
}

// UI and Component Types
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  error: string | null;
  code?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Chart and Analytics Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

export interface AnalyticsData {
  totalBalance: number;
  totalTransactions: number;
  miningRewards: number;
  portfolioValue: number;
  performance24h: number;
  performance7d: number;
  performance30d: number;
}

// Form Types
export interface TransactionFormData {
  recipientAddress: string;
  amount: number;
  currency: Currency;
  fee: number;
  description?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}