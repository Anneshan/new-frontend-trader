import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../../hooks/useToast';

describe('useToast', () => {
  it('should initialize with empty toasts', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add success toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].title).toBe('Success message');
  });

  it('should add error toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Error message', 'Error details');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].title).toBe('Error message');
    expect(result.current.toasts[0].message).toBe('Error details');
  });

  it('should remove toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success message');
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add multiple toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success 1');
      result.current.error('Error 1');
      result.current.warning('Warning 1');
      result.current.info('Info 1');
    });

    expect(result.current.toasts).toHaveLength(4);
    expect(result.current.toasts.map(t => t.type)).toEqual(['success', 'error', 'warning', 'info']);
  });
});