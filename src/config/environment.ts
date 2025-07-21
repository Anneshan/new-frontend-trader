interface EnvironmentConfig {
  APP_NAME: string;
  APP_VERSION: string;
  APP_ENVIRONMENT: string;
  API_URL: string;
  WS_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  ENABLE_HTTPS: boolean;
  ENABLE_CSP: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_ERROR_REPORTING: boolean;
  ENABLE_PERFORMANCE_MONITORING: boolean;
  ENABLE_DEVTOOLS: boolean;
  LOG_LEVEL: string;
  SENTRY_DSN?: string;
  ANALYTICS_ID?: string;
  ENCRYPTION_KEY: string;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    APP_NAME: import.meta.env.VITE_APP_NAME || 'CopyTrader Pro',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws',
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    ENABLE_HTTPS: import.meta.env.VITE_ENABLE_HTTPS === 'true',
    ENABLE_CSP: import.meta.env.VITE_ENABLE_CSP === 'true',
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
    ENABLE_DEVTOOLS: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
    LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
    ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY || 'your-32-character-encryption-key-here',
  };
};

export const config = getEnvironmentConfig();

export const isDevelopment = config.APP_ENVIRONMENT === 'development';
export const isProduction = config.APP_ENVIRONMENT === 'production';
export const isTest = config.APP_ENVIRONMENT === 'test';

// Validate required environment variables
export const validateConfig = (): void => {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = requiredVars.filter(key => !config[key as keyof EnvironmentConfig]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate encryption key length
  if (config.ENCRYPTION_KEY.length !== 32) {
    console.warn('ENCRYPTION_KEY should be exactly 32 characters long for optimal security');
  }
};