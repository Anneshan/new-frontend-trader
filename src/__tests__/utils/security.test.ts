import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SecurityUtils } from '../../utils/security';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SecurityUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('[]');
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = SecurityUtils.sanitizeInput(input);
      expect(result).toBe('scriptalert("xss")/script');
    });

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert("xss")';
      const result = SecurityUtils.sanitizeInput(input);
      expect(result).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      const input = 'onclick=alert("xss")';
      const result = SecurityUtils.sanitizeInput(input);
      expect(result).toBe('alert("xss")');
    });
  });

  describe('validateApiKey', () => {
    it('should validate correct API key format', () => {
      const validKey = 'abcdef1234567890abcdef1234567890';
      expect(SecurityUtils.validateApiKey(validKey)).toBe(true);
    });

    it('should reject short API keys', () => {
      const shortKey = 'short';
      expect(SecurityUtils.validateApiKey(shortKey)).toBe(false);
    });

    it('should reject API keys with special characters', () => {
      const invalidKey = 'abc-def-123-456-789-012-345-678';
      expect(SecurityUtils.validateApiKey(invalidKey)).toBe(false);
    });
  });

  describe('validateApiSecret', () => {
    it('should validate correct API secret format', () => {
      const validSecret = 'abcdef1234567890abcdef1234567890abcdef12';
      expect(SecurityUtils.validateApiSecret(validSecret)).toBe(true);
    });

    it('should accept base64 characters', () => {
      const validSecret = 'abcdef1234567890+/=abcdef1234567890';
      expect(SecurityUtils.validateApiSecret(validSecret)).toBe(true);
    });
  });

  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const result = SecurityUtils.checkRateLimit('test', 5, 60000);
      expect(result).toBe(true);
    });

    it('should block requests exceeding limit', () => {
      // Mock localStorage to return requests at limit
      const now = Date.now();
      const requests = Array(5).fill(now);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(requests));

      const result = SecurityUtils.checkRateLimit('test', 5, 60000);
      expect(result).toBe(false);
    });
  });

  describe('obfuscateApiKey', () => {
    it('should obfuscate long API keys', () => {
      const apiKey = 'abcdef1234567890abcdef1234567890';
      const result = SecurityUtils.obfuscateApiKey(apiKey);
      expect(result).toBe('abcd************************7890');
    });

    it('should not obfuscate short API keys', () => {
      const apiKey = 'short';
      const result = SecurityUtils.obfuscateApiKey(apiKey);
      expect(result).toBe('short');
    });
  });

  describe('validateSessionToken', () => {
    it('should validate JWT format', () => {
      const validToken = 'header.payload.signature';
      expect(SecurityUtils.validateSessionToken(validToken)).toBe(true);
    });

    it('should reject invalid format', () => {
      const invalidToken = 'invalid-token';
      expect(SecurityUtils.validateSessionToken(invalidToken)).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('should give high score for strong password', () => {
      const strongPassword = 'StrongPassword123!';
      const result = SecurityUtils.checkPasswordStrength(strongPassword);
      expect(result.score).toBe(5);
      expect(result.feedback).toHaveLength(0);
    });

    it('should give low score for weak password', () => {
      const weakPassword = 'weak';
      const result = SecurityUtils.checkPasswordStrength(weakPassword);
      expect(result.score).toBeLessThan(5);
      expect(result.feedback.length).toBeGreaterThan(0);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const validEmail = 'test@example.com';
      expect(SecurityUtils.validateEmail(validEmail)).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidEmail = 'invalid-email';
      expect(SecurityUtils.validateEmail(invalidEmail)).toBe(false);
    });
  });

  describe('generateSecureId', () => {
    it('should generate ID of correct length', () => {
      const id = SecurityUtils.generateSecureId(16);
      expect(id).toHaveLength(16);
    });

    it('should generate different IDs', () => {
      const id1 = SecurityUtils.generateSecureId();
      const id2 = SecurityUtils.generateSecureId();
      expect(id1).not.toBe(id2);
    });
  });
});