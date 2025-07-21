import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Account validation schemas
export const addAccountSchema = z.object({
  name: z.string().min(3, 'Account name must be at least 3 characters').max(100),
  broker: z.enum(['delta', 'binance', 'bybit', 'okx'], {
    errorMap: () => ({ message: 'Please select a valid broker' })
  }),
  apiKey: z.string().min(10, 'API key must be at least 10 characters'),
  apiSecret: z.string().min(10, 'API secret must be at least 10 characters'),
});

// Subscription validation schemas
export const subscriptionSchema = z.object({
  masterAccountId: z.string().min(1, 'Please select a master account'),
  multiplier: z.number()
    .min(0.1, 'Multiplier must be at least 0.1')
    .max(10, 'Multiplier cannot exceed 10'),
  maxPositionSize: z.number()
    .min(1, 'Position size must be at least $1')
    .max(1000000, 'Position size cannot exceed $1,000,000'),
  dailyLossLimit: z.number()
    .min(1, 'Loss limit must be at least $1')
    .max(100000, 'Loss limit cannot exceed $100,000'),
});

// Profile validation schema
export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type AddAccountFormData = z.infer<typeof addAccountSchema>;
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;