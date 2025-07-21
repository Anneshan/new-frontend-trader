import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_anon_key_here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on your schema
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  twoFaEnabled: boolean;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrokerAccount {
  id: string;
  userId: string;
  broker: 'DELTA' | 'BINANCE' | 'BYBIT' | 'OKX';
  accountType: 'MASTER' | 'FOLLOWER';
  name: string;
  isActive: boolean;
  balance: number;
  pnl: number;
  lastSync: string;
  winRate: number;
  totalTrades: number;
  followers: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  monthlyReturn: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  userId: string;
  accountId: string;
  subscriptionId?: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  executedPrice?: number;
  pnl: number;
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
  brokerTradeId?: string;
  isCopyTrade: boolean;
  masterTradeId?: string;
  executionTime?: number;
  slippage?: number;
  fees?: number;
  executedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  masterAccountId: string;
  followerAccountId: string;
  multiplier: number;
  maxPositionSize: number;
  dailyLossLimit: number;
  isActive: boolean;
  pnl: number;
  totalTrades: number;
  winRate: number;
  monthlyReturn: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketData {
  id: string;
  accountId: string;
  symbol: string;
  price: number;
  bid?: number;
  ask?: number;
  volume?: number;
  change24h?: number;
  volume24h?: number;
  spread?: number;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'TRADE_EXECUTED' | 'ACCOUNT_SYNC' | 'SUBSCRIPTION_UPDATE' | 'SYSTEM_ALERT' | 'PERFORMANCE_UPDATE' | 'SECURITY_ALERT';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

export interface MasterTrader {
  id: string;
  name: string;
  broker: 'DELTA' | 'BINANCE' | 'BYBIT' | 'OKX';
  winRate: number;
  monthlyReturn: number;
  followers: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  pnl: number;
  totalTrades: number;
  isActive: boolean;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Real-time data service
export class RealTimeDataService {
  // Subscribe to trade updates
  static subscribeToTrades(userId: string, callback: (trade: Trade) => void) {
    return supabase
      .channel('trades')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trades',
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Trade);
        }
      )
      .subscribe();
  }

  // Subscribe to account updates
  static subscribeToAccounts(userId: string, callback: (account: BrokerAccount) => void) {
    return supabase
      .channel('accounts')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'broker_accounts',
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as BrokerAccount);
        }
      )
      .subscribe();
  }

  // Subscribe to market data updates
  static subscribeToMarketData(accountId: string, callback: (data: MarketData) => void) {
    return supabase
      .channel('market_data')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'market_data',
          filter: `accountId=eq.${accountId}`,
        },
        (payload) => {
          callback(payload.new as MarketData);
        }
      )
      .subscribe();
  }

  // Subscribe to notifications
  static subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();
  }
}

// Data service for CRUD operations
export class DataService {
  // Authentication
  static async signUp(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
        },
      },
    });
    return { data, error };
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  // Broker Accounts
  static async getBrokerAccounts(userId: string): Promise<BrokerAccount[]> {
    const { data, error } = await supabase
      .from('broker_accounts')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createBrokerAccount(account: Omit<BrokerAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrokerAccount> {
    const { data, error } = await supabase
      .from('broker_accounts')
      .insert(account)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Trades
  static async getTrades(userId: string, limit = 50): Promise<Trade[]> {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async createTrade(trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trade> {
    const { data, error } = await supabase
      .from('trades')
      .insert(trade)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Subscriptions
  static async getSubscriptions(userId: string): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        masterAccount:broker_accounts!masterAccountId(name, broker),
        followerAccount:broker_accounts!followerAccountId(name, broker)
      `)
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Market Data
  static async getMarketData(accountId: string, symbol?: string): Promise<MarketData[]> {
    let query = supabase
      .from('market_data')
      .select('*')
      .eq('accountId', accountId)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (symbol) {
      query = query.eq('symbol', symbol);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Master Traders
  static async getMasterTraders(): Promise<MasterTrader[]> {
    const { data, error } = await supabase
      .from('master_traders')
      .select('*')
      .eq('isActive', true)
      .order('followers', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Notifications
  static async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ isRead: true, readAt: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;
  }
} 