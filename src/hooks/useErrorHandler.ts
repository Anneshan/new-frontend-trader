import { useState, useCallback } from 'react';
import { AppError, handleError, logError } from '../utils/errorHandling';

interface ErrorState {
  error: AppError | null;
  isError: boolean;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
  });

  const handleErrorCallback = useCallback((error: unknown, context?: string) => {
    const appError = handleError(error);
    logError(appError, context);
    
    setErrorState({
      error: appError,
      isError: true,
    });

    // Auto-clear error after 5 seconds for non-critical errors
    if (appError.statusCode < 500) {
      setTimeout(() => {
        clearError();
      }, 5000);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
    });
  }, []);

  return {
    error: errorState.error,
    isError: errorState.isError,
    handleError: handleErrorCallback,
    clearError,
  };
};