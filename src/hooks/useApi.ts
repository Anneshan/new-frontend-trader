import { useState, useCallback } from 'react';
import { AppError, NetworkError, AuthenticationError } from '../utils/errorHandling';
import { SecurityUtils } from '../utils/security';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

export const useApi = <T = any>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(async (url: string, options: ApiOptions = {}) => {
    const {
      method = 'GET',
      headers = {},
      body,
      requireAuth = true,
    } = options;

    // Rate limiting check
    if (!SecurityUtils.checkRateLimit(`api_${url}`, 30, 60000)) {
      throw new AppError('Rate limit exceeded. Please wait before making more requests.', 429);
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = localStorage.getItem('authToken');
      
      if (requireAuth && !token) {
        throw new AuthenticationError('Authentication required');
      }

      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
      };

      if (requireAuth && token) {
        if (!SecurityUtils.validateSessionToken(token)) {
          localStorage.removeItem('authToken');
          throw new AuthenticationError('Invalid session token');
        }
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            localStorage.removeItem('authToken');
            throw new AuthenticationError('Session expired');
          case 403:
            throw new AppError('Access denied', 403);
          case 404:
            throw new AppError('Resource not found', 404);
          case 429:
            throw new AppError('Rate limit exceeded', 429);
          case 500:
            throw new AppError('Server error', 500);
          default:
            throw new AppError(`Request failed with status ${response.status}`, response.status);
        }
      }

      const data = await response.json();
      
      setState(prev => ({ ...prev, data, loading: false }));
      return data;
    } catch (error) {
      const appError = error instanceof AppError ? error : new NetworkError('Network request failed');
      setState(prev => ({ ...prev, error: appError, loading: false }));
      throw appError;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    request,
    reset,
  };
};