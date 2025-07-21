import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { AppError } from '../../utils/errorHandling';

describe('useErrorHandler', () => {
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    // Mock console.error to suppress expected error logging during tests
    originalConsoleError = console.error;
    console.error = vi.fn();
  });

  afterAll(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('should handle AppError correctly', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new AppError('Test error', 400);
    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.isError).toBe(true);
  });

  it('should handle generic Error correctly', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Generic error');

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.error?.message).toBe('Generic error');
    expect(result.current.isError).toBe(true);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new AppError('Test error');

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.isError).toBe(true);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('should auto-clear non-critical errors', async () => {
    vi.useFakeTimers();
    
    const { result } = renderHook(() => useErrorHandler());
    const testError = new AppError('Test error', 400); // Non-critical error

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.isError).toBe(true);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);

    vi.useRealTimers();
  });
});