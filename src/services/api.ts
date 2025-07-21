import { API_CONFIG, API_ENDPOINTS, getAuthHeaders, ApiResponse, ApiError } from '../config/api';

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config: RequestInit = {
      headers: getAuthHeaders(token || undefined),
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // Very short timeout for quick fallback
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
        
        throw new Error(errorMessage);
      }
      
      const data: ApiResponse<T> = await response.json();


      if (!data.success) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('BACKEND_UNAVAILABLE');
      }
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('BACKEND_UNAVAILABLE');
      }
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getProfile() {
    return this.request(API_ENDPOINTS.AUTH.PROFILE);
  }

  async updateProfile(userData: any) {
    return this.request(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Broker account methods
  async getAccounts() {
    return this.request(API_ENDPOINTS.ACCOUNTS.LIST);
  }

  async createAccount(accountData: {
    name: string;
    broker: string;
    accountType: string;
    apiKey: string;
    apiSecret: string;
    passphrase?: string;
  }) {
    console.log('📡 API: Creating account...', { 
      name: accountData.name, 
      broker: accountData.broker, 
      accountType: accountData.accountType 
    });
    
    const response = await this.request(API_ENDPOINTS.ACCOUNTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
    
    console.log('📡 API: Account creation response:', response);
    return response;
  }

  async updateAccount(id: string, updates: any) {
    return this.request(API_ENDPOINTS.ACCOUNTS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAccount(id: string) {
    return this.request(API_ENDPOINTS.ACCOUNTS.DELETE(id), {
      method: 'DELETE',
    });
  }

  async validateAccount(id: string) {
    return this.request(API_ENDPOINTS.ACCOUNTS.VALIDATE(id), {
      method: 'POST',
    });
  }

  async syncAccount(id: string) {
    return this.request(API_ENDPOINTS.ACCOUNTS.SYNC(id), {
      method: 'POST',
    });
  }

  async getSupportedBrokers() {
    return this.request(API_ENDPOINTS.ACCOUNTS.BROKERS);
  }

  // Subscription methods
  async getSubscriptions() {
    return this.request(API_ENDPOINTS.SUBSCRIPTIONS.LIST);
  }

  async createSubscription(subscriptionData: any) {
    return this.request(API_ENDPOINTS.SUBSCRIPTIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  }

  async updateSubscription(id: string, updates: any) {
    return this.request(API_ENDPOINTS.SUBSCRIPTIONS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSubscription(id: string) {
    return this.request(API_ENDPOINTS.SUBSCRIPTIONS.DELETE(id), {
      method: 'DELETE',
    });
  }

  // Trading methods
  async getTrades(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`${API_ENDPOINTS.TRADING.TRADES}${query}`);
  }

  async getPositions() {
    return this.request(API_ENDPOINTS.TRADING.POSITIONS);
  }

  async getPerformance() {
    return this.request(API_ENDPOINTS.TRADING.PERFORMANCE);
  }

  async getMasterTraders() {
    return this.request(API_ENDPOINTS.TRADING.MASTERS);
  }

  // Analytics methods
  async getDashboardData() {
    return this.request(API_ENDPOINTS.ANALYTICS.DASHBOARD);
  }

  async getPerformanceAnalytics(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`${API_ENDPOINTS.ANALYTICS.PERFORMANCE}${query}`);
  }

  async generateReport(type: string, params?: any) {
    return this.request(API_ENDPOINTS.ANALYTICS.REPORTS, {
      method: 'POST',
      body: JSON.stringify({ type, ...params }),
    });
  }

  // Health check
  async getHealthStatus() {
    return this.request(API_ENDPOINTS.HEALTH.STATUS);
  }
}

export const apiService = new ApiService();
export default apiService;