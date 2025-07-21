import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { encryptApiCredentials, validateApiKey, validateApiSecret } from '../utils/encryption';

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface BrokerAccount {
  id: string;
  userId: string;
  broker: 'DELTA' | 'BINANCE' | 'BYBIT' | 'OKX';
  accountType: 'MASTER' | 'FOLLOWER';
  name: string;
  apiKey?: string;
  apiSecret?: string;
  isActive: boolean;
  balance: number;
  pnl: number;
  lastSync: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  followerAccountId: string;
  masterAccountId: string;
  multiplier: number;
  isActive: boolean;
  pnl: number;
  trades: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  accountId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  pnl: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

interface TradingContextType {
  brokerAccounts: BrokerAccount[];
  subscriptions: Subscription[];
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
  addBrokerAccount: (account: Omit<BrokerAccount, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  updateBrokerAccount: (id: string, updates: Partial<BrokerAccount>) => Promise<{ success: boolean; error?: string }>;
  deleteBrokerAccount: (id: string) => Promise<{ success: boolean; error?: string }>;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<{ success: boolean; error?: string }>;
  deleteSubscription: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => Promise<void>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

interface TradingProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const TradingProvider: React.FC<TradingProviderProps> = ({ children, userId }) => {
  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to prevent unnecessary re-renders
  const channelsRef = useRef<any[]>([]);
  const loadingRef = useRef(false);

  // Memoized data loading function with debouncing
  const loadData = useCallback(async () => {
    if (!userId || loadingRef.current) return;

    try {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);

      // Load broker accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('broker_accounts')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (accountsError) throw accountsError;

      // Load subscriptions
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('followerAccountId', userId)
        .order('createdAt', { ascending: false });

      if (subsError) throw subsError;

      // Load trades (limit to recent for performance)
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .eq('accountId', userId)
        .order('createdAt', { ascending: false })
        .limit(50); // Reduced limit for better performance

      if (tradesError) throw tradesError;

      setBrokerAccounts(accountsData || []);
      setSubscriptions(subsData || []);
      setTrades(tradesData || []);
    } catch (err) {
      console.error('Error loading trading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [userId]);

  // Initial data load with delay to prevent blocking
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 100); // Small delay to prevent blocking UI

    return () => clearTimeout(timer);
  }, [loadData]);

  // Optimized real-time subscriptions with cleanup
  useEffect(() => {
    if (!userId) return;

    // Clean up existing channels
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

    // Create new channels with optimized settings
    const accountsChannel = supabase
      .channel('broker_accounts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'broker_accounts',
          filter: `userId=eq.${userId}`,
        },
        (payload: any) => {
          // Debounce updates to prevent excessive re-renders
          setTimeout(() => {
            loadData();
          }, 500);
        }
      )
      .subscribe();

    const subscriptionsChannel = supabase
      .channel('subscriptions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `followerAccountId=eq.${userId}`,
        },
        (payload: any) => {
          setTimeout(() => {
            loadData();
          }, 500);
        }
      )
      .subscribe();

    const tradesChannel = supabase
      .channel('trades_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `accountId=eq.${userId}`,
        },
        (payload: any) => {
          setTimeout(() => {
            loadData();
          }, 500);
        }
      )
      .subscribe();

    // Store channels for cleanup
    channelsRef.current = [accountsChannel, subscriptionsChannel, tradesChannel];

    return () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [userId, loadData]);

  // Optimized CRUD operations with memoization
  const addBrokerAccount = useCallback(async (account: Omit<BrokerAccount, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return { success: false, error: 'User not authenticated' };

    try {
      // Validate required fields
      if (!account.name || !account.broker || !account.apiKey || !account.apiSecret) {
        return { success: false, error: 'All fields are required' };
      }

      // Validate API credentials format
      if (!validateApiKey(account.apiKey)) {
        return { success: false, error: 'Invalid API key format' };
      }

      if (!validateApiSecret(account.apiSecret)) {
        return { success: false, error: 'Invalid API secret format' };
      }

      // Encrypt API credentials before storing
      const encryptedApiKey = await encryptApiCredentials(account.apiKey);
      const encryptedApiSecret = await encryptApiCredentials(account.apiSecret);

      // Create account with encrypted API credentials
      const { data, error } = await supabase
        .from('broker_accounts')
        .insert([{ 
          ...account, 
          userId,
          apiKey: encryptedApiKey,
          apiSecret: encryptedApiSecret,
        }])
        .select()
        .single();

      if (error) throw error;

      setBrokerAccounts(prev => [data, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('Error adding broker account:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add account' };
    }
  }, [userId]);

  const updateBrokerAccount = useCallback(async (id: string, updates: Partial<BrokerAccount>) => {
    try {
      // If API credentials are being updated, encrypt them
      let encryptedUpdates = { ...updates };
      
      if (updates.apiKey) {
        if (!validateApiKey(updates.apiKey)) {
          return { success: false, error: 'Invalid API key format' };
        }
        encryptedUpdates.apiKey = await encryptApiCredentials(updates.apiKey);
      }
      
      if (updates.apiSecret) {
        if (!validateApiSecret(updates.apiSecret)) {
          return { success: false, error: 'Invalid API secret format' };
        }
        encryptedUpdates.apiSecret = await encryptApiCredentials(updates.apiSecret);
      }

      const { data, error } = await supabase
        .from('broker_accounts')
        .update(encryptedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBrokerAccounts(prev => prev.map(acc => acc.id === id ? data : acc));
      return { success: true };
    } catch (err) {
      console.error('Error updating broker account:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update account' };
    }
  }, []);

  const deleteBrokerAccount = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('broker_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBrokerAccounts(prev => prev.filter(acc => acc.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting broker account:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete account' };
    }
  }, []);

  const addSubscription = useCallback(async (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscription])
        .select()
        .single();

      if (error) throw error;

      setSubscriptions(prev => [data, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('Error adding subscription:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add subscription' };
    }
  }, []);

  const updateSubscription = useCallback(async (id: string, updates: Partial<Subscription>) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSubscriptions(prev => prev.map(sub => sub.id === id ? data : sub));
      return { success: true };
    } catch (err) {
      console.error('Error updating subscription:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update subscription' };
    }
  }, []);

  const deleteSubscription = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting subscription:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete subscription' };
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Highly optimized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    brokerAccounts,
    subscriptions,
    trades,
    isLoading,
    error,
    addBrokerAccount,
    updateBrokerAccount,
    deleteBrokerAccount,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refreshData,
  }), [
    brokerAccounts,
    subscriptions,
    trades,
    isLoading,
    error,
    addBrokerAccount,
    updateBrokerAccount,
    deleteBrokerAccount,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refreshData,
  ]);

  return (
    <TradingContext.Provider value={contextValue}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = (): TradingContextType => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};