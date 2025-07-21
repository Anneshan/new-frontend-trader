export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  ACCOUNTS: {
    LIST: '/accounts',
    CREATE: '/accounts',
    UPDATE: (id: string) => `/accounts/${id}`,
    DELETE: (id: string) => `/accounts/${id}`,
    VALIDATE: '/accounts/validate',
  },
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    CREATE: '/subscriptions',
    UPDATE: (id: string) => `/subscriptions/${id}`,
    DELETE: (id: string) => `/subscriptions/${id}`,
  },
  TRADING: {
    TRADES: '/trading/trades',
    POSITIONS: '/trading/positions',
    PERFORMANCE: '/trading/performance',
    MASTERS: '/trading/masters',
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    PERFORMANCE: '/analytics/performance',
    REPORTS: '/analytics/reports',
  },
} as const;

export const BROKER_CONFIG = {
  delta: {
    name: 'Delta Exchange',
    logo: '🔺',
    apiUrl: 'https://api.delta.exchange',
    wsUrl: 'wss://socket.delta.exchange',
    requiredPermissions: ['read', 'trade'],
  },
  binance: {
    name: 'Binance Futures',
    logo: '🟡',
    apiUrl: 'https://fapi.binance.com',
    wsUrl: 'wss://fstream.binance.com',
    requiredPermissions: ['read', 'trade'],
  },
  bybit: {
    name: 'Bybit',
    logo: '🟠',
    apiUrl: 'https://api.bybit.com',
    wsUrl: 'wss://stream.bybit.com',
    requiredPermissions: ['read', 'trade'],
  },
  okx: {
    name: 'OKX',
    logo: '⚪',
    apiUrl: 'https://www.okx.com',
    wsUrl: 'wss://ws.okx.com',
    requiredPermissions: ['read', 'trade'],
  },
} as const;

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  MULTIPLIER: {
    MIN: 0.1,
    MAX: 10,
    STEP: 0.1,
  },
  POSITION_SIZE: {
    MIN: 1,
    MAX: 1000000,
  },
  LOSS_LIMIT: {
    MIN: 1,
    MAX: 100000,
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  RATE_LIMIT: 'Too many requests. Please wait before trying again.',
} as const;

export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Account created successfully',
  ACCOUNT_UPDATED: 'Account updated successfully',
  ACCOUNT_DELETED: 'Account deleted successfully',
  SUBSCRIPTION_CREATED: 'Subscription created successfully',
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully',
  SUBSCRIPTION_DELETED: 'Subscription deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
} as const;

export const TRADING_SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',
  'ADAUSDT',
  'DOTUSDT',
  'LINKUSDT',
  'LTCUSDT',
  'XRPUSDT',
  'SOLUSDT',
] as const;

export const RISK_LEVELS = {
  LOW: { label: 'Low', color: 'text-green-400', maxMultiplier: 2 },
  MEDIUM: { label: 'Medium', color: 'text-yellow-400', maxMultiplier: 5 },
  HIGH: { label: 'High', color: 'text-red-400', maxMultiplier: 10 },
} as const;