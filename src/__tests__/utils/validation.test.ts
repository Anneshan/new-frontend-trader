import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, addAccountSchema, subscriptionSchema } from '../../utils/validation';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'weak',
        confirmPassword: 'weak',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'john.doe@example.com',
        password: 'Password123!',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123!',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('addAccountSchema', () => {
    it('should validate correct account data', () => {
      const validData = {
        name: 'My Trading Account',
        broker: 'delta' as const,
        apiKey: 'valid-api-key-123',
        apiSecret: 'valid-api-secret-456',
      };

      const result = addAccountSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid broker', () => {
      const invalidData = {
        name: 'My Trading Account',
        broker: 'invalid-broker',
        apiKey: 'valid-api-key-123',
        apiSecret: 'valid-api-secret-456',
      };

      const result = addAccountSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('subscriptionSchema', () => {
    it('should validate correct subscription data', () => {
      const validData = {
        masterAccountId: 'master-123',
        multiplier: 2.5,
        maxPositionSize: 10000,
        dailyLossLimit: 1000,
      };

      const result = subscriptionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid multiplier', () => {
      const invalidData = {
        masterAccountId: 'master-123',
        multiplier: 15, // Too high
        maxPositionSize: 10000,
        dailyLossLimit: 1000,
      };

      const result = subscriptionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});