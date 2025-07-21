// API Configuration for Frontend
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Broker Accounts
  ACCOUNTS: {
    LIST: '/accounts',
    CREATE: '/accounts',
    UPDATE: (id: string) => `/accounts/${id}`,
    DELETE: (id: string) => `/accounts/${id}`,
    VALIDATE: (id: string) => `/accounts/${id}/validate`,
    SYNC: (id: string) => `/accounts/${id}/sync`,
    BROKERS: '/accounts/brokers',
  },
  
  // Subscriptions
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    CREATE: '/subscriptions',
    UPDATE: (id: string) => `/subscriptions/${id}`,
    DELETE: (id: string) => `/subscriptions/${id}`,
  },
  
  // Trading
  TRADING: {
    TRADES: '/trading/trades',
    POSITIONS: '/trading/positions',
    PERFORMANCE: '/trading/performance',
    MASTERS: '/trading/masters',
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    PERFORMANCE: '/analytics/performance',
    REPORTS: '/analytics/reports',
  },
  
  // Health
  HEALTH: {
    STATUS: '/health',
    DETAILED: '/health/detailed',
  },
} as const;

// Request headers
export const getAuthHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

// Error response interface
export interface ApiError {
  message: string;
  details?: any;
  statusCode?: number;
}

// Success response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}