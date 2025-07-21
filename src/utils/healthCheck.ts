interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, {
    status: 'pass' | 'fail';
    message: string;
    duration: number;
  }>;
  timestamp: string;
}

export class HealthChecker {
  private checks: Map<string, () => Promise<boolean>> = new Map();

  // Register a health check
  registerCheck(name: string, checkFn: () => Promise<boolean>): void {
    this.checks.set(name, checkFn);
  }

  // Run all health checks
  async runChecks(): Promise<HealthCheckResult> {
    const results: HealthCheckResult['checks'] = {};
    let overallStatus: HealthCheckResult['status'] = 'healthy';

    for (const [name, checkFn] of this.checks) {
      const start = performance.now();
      
      try {
        const passed = await Promise.race([
          checkFn(),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        const duration = performance.now() - start;
        
        results[name] = {
          status: passed ? 'pass' : 'fail',
          message: passed ? 'OK' : 'Check failed',
          duration,
        };

        if (!passed) {
          overallStatus = overallStatus === 'healthy' ? 'degraded' : 'unhealthy';
        }
      } catch (error) {
        const duration = performance.now() - start;
        
        results[name] = {
          status: 'fail',
          message: error instanceof Error ? error.message : 'Unknown error',
          duration,
        };

        overallStatus = 'unhealthy';
      }
    }

    return {
      status: overallStatus,
      checks: results,
      timestamp: new Date().toISOString(),
    };
  }
}

// Default health checks
export const setupDefaultHealthChecks = (healthChecker: HealthChecker) => {
  // Check if localStorage is available
  healthChecker.registerCheck('localStorage', async () => {
    try {
      const testKey = '__health_check__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  });

  // Check if API is reachable
  healthChecker.registerCheck('api', async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  });

  // Check WebSocket connectivity
  healthChecker.registerCheck('websocket', async () => {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket('wss://192.168.1.104/ws/health');
        
        const timeout = setTimeout(() => {
          ws.close();
          resolve(false);
        }, 3000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  });

  // Check memory usage
  healthChecker.registerCheck('memory', async () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      return usedRatio < 0.9; // Fail if using more than 90% of available memory
    }
    return true; // Pass if memory API not available
  });

  // Check if critical features are working
  healthChecker.registerCheck('features', async () => {
    try {
      // Test JSON parsing
      JSON.parse('{"test": true}');
      
      // Test Promise support
      await Promise.resolve(true);
      
      // Test fetch support
      if (typeof fetch === 'undefined') {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  });
};

// Continuous health monitoring
export class HealthMonitor {
  private healthChecker: HealthChecker;
  private intervalId: number | null = null;
  private listeners: ((result: HealthCheckResult) => void)[] = [];

  constructor() {
    this.healthChecker = new HealthChecker();
    setupDefaultHealthChecks(this.healthChecker);
  }

  // Start monitoring
  start(intervalMs: number = 30000): void {
    if (this.intervalId) {
      this.stop();
    }

    this.intervalId = window.setInterval(async () => {
      const result = await this.healthChecker.runChecks();
      this.notifyListeners(result);
      
      if (result.status === 'unhealthy') {
        console.error('Health check failed:', result);
      }
    }, intervalMs);

    // Run initial check
    this.healthChecker.runChecks().then(result => {
      this.notifyListeners(result);
    });
  }

  // Stop monitoring
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Add listener for health check results
  addListener(listener: (result: HealthCheckResult) => void): void {
    this.listeners.push(listener);
  }

  // Remove listener
  removeListener(listener: (result: HealthCheckResult) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Get health checker instance
  getHealthChecker(): HealthChecker {
    return this.healthChecker;
  }

  private notifyListeners(result: HealthCheckResult): void {
    this.listeners.forEach(listener => {
      try {
        listener(result);
      } catch (error) {
        console.error('Error in health check listener:', error);
      }
    });
  }
}