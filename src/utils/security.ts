import { AppError } from './errorHandling';

export class SecurityUtils {
  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  // Validate API key format
  static validateApiKey(apiKey: string): boolean {
    // Basic validation - should be alphanumeric and of reasonable length
    const apiKeyRegex = /^[A-Za-z0-9]{20,100}$/;
    return apiKeyRegex.test(apiKey);
  }

  // Validate API secret format
  static validateApiSecret(apiSecret: string): boolean {
    // Basic validation - should be alphanumeric and of reasonable length
    const apiSecretRegex = /^[A-Za-z0-9+/=]{20,200}$/;
    return apiSecretRegex.test(apiSecret);
  }

  // Rate limiting check (client-side)
  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validRequests));
    return true;
  }

  // Encrypt sensitive data (client-side obfuscation)
  static obfuscateApiKey(apiKey: string): string {
    if (apiKey.length <= 8) return apiKey;
    const start = apiKey.substring(0, 4);
    const end = apiKey.substring(apiKey.length - 4);
    const middle = '*'.repeat(apiKey.length - 8);
    return `${start}${middle}${end}`;
  }

  // Validate session token format
  static validateSessionToken(token: string): boolean {
    try {
      const parts = token.split('.');
      return parts.length === 3; // JWT format
    } catch {
      return false;
    }
  }

  // Check password strength
  static checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    return { score, feedback };
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Generate secure random string
  static generateSecureId(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const validateEnvironment = (): void => {
  // Optional validation - don't throw errors in production
  const requiredEnvVars = [
    'VITE_API_URL',
    'VITE_WS_URL',
  ];

  const missing = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
};

export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};