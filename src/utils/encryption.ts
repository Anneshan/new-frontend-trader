// Frontend encryption utility for API credentials
// Uses Web Crypto API for client-side encryption

import { config } from '../config/environment';

// const ENCRYPTION_KEY = config.ENCRYPTION_KEY;
const ENCRYPTION_KEY = 'a1b2c3d4e5f678901234567890abcdef';
const ALGORITHM = 'aes-256-gcm';

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be exactly 32 characters long');
}

console.log('ENCRYPTION_KEY value:', ENCRYPTION_KEY, 'length:', ENCRYPTION_KEY.length);

// Convert string key to CryptoKey
async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(ENCRYPTION_KEY);
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt API credentials
export const encryptApiCredentials = async (text: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt API credentials');
  }
};

// Decrypt API credentials
export const decryptApiCredentials = async (encryptedText: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    
    // Convert from base64
    const combined = new Uint8Array(
      atob(encryptedText).split('').map(char => char.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt API credentials');
  }
};

// Hash sensitive data (for comparison, not reversible)
export const hashSensitiveData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate secure random string
export const generateSecureString = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate API key format (basic validation)
export const validateApiKey = (apiKey: string): boolean => {
  // Basic validation - adjust based on broker requirements
  return apiKey.length >= 10 && /^[a-zA-Z0-9_-]+$/.test(apiKey);
};

// Validate API secret format (basic validation)
export const validateApiSecret = (apiSecret: string): boolean => {
  // Basic validation - adjust based on broker requirements
  return apiSecret.length >= 10 && /^[a-zA-Z0-9_-]+$/.test(apiSecret);
}; 
