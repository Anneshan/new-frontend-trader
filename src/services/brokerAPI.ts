export interface BrokerConfig {
  name: string;
  apiUrl: string;
  wsUrl: string;
  testnet?: boolean;
}

export interface OrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  price?: number;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
}

export interface OrderResponse {
  orderId: string;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  status: 'NEW' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED';
  executionTime: number;
  slippage: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  timestamp: number;
}

export class RealTimeBrokerAPI {
  private ws: WebSocket | null = null;
  private config: BrokerConfig;
  private apiKey: string;
  private apiSecret: string;
  private isConnected = false;
  private orderQueue: OrderRequest[] = [];
  private executionTimes: number[] = [];
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor(config: BrokerConfig, apiKey: string, apiSecret: string) {
    this.config = config;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  // Custom event system for browser compatibility
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
  }

  // Connect to real-time WebSocket feed
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log(`🔌 Connecting to ${this.config.name} WebSocket...`);
        
        this.ws = new WebSocket(this.config.wsUrl);
        
        this.ws.onopen = () => {
          console.log(`✅ Connected to ${this.config.name}`);
          this.isConnected = true;
          this.authenticate();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
          console.error(`❌ WebSocket error:`, error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log(`🔌 Disconnected from ${this.config.name}`);
          this.isConnected = false;
          this.reconnect();
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  // Authenticate WebSocket connection
  private authenticate(): void {
    const timestamp = Date.now();
    const signature = this.generateSignature(timestamp);
    
    const authMessage = {
      method: 'auth',
      params: {
        apiKey: this.apiKey,
        timestamp,
        signature
      }
    };

    this.send(authMessage);
  }

  // Generate HMAC signature for authentication
  private generateSignature(timestamp: number): string {
    // This would use crypto.createHmac in a real implementation
    // For demo, returning a mock signature
    return `mock_signature_${timestamp}`;
  }

  // Subscribe to real-time market data
  subscribeToMarketData(symbols: string[]): void {
    const subscribeMessage = {
      method: 'subscribe',
      params: symbols.map(symbol => `${symbol.toLowerCase()}@ticker`)
    };

    this.send(subscribeMessage);
    console.log(`📊 Subscribed to market data for: ${symbols.join(', ')}`);
  }

  // Ultra-fast order execution with slippage protection
  async executeOrder(order: OrderRequest): Promise<OrderResponse> {
    const startTime = performance.now();
    
    try {
      // Get real-time price for slippage calculation
      const currentPrice = await this.getCurrentPrice(order.symbol);
      
      // Calculate optimal execution price
      const executionPrice = this.calculateOptimalPrice(order, currentPrice);
      
      // Execute order via REST API for guaranteed execution
      const response = await this.sendOrderToExchange({
        ...order,
        price: executionPrice
      });

      const executionTime = performance.now() - startTime;
      this.executionTimes.push(executionTime);

      // Calculate actual slippage
      const expectedPrice = order.price || currentPrice;
      const slippage = Math.abs((response.price - expectedPrice) / expectedPrice) * 100;

      console.log(`⚡ Order executed in ${executionTime.toFixed(2)}ms with ${slippage.toFixed(4)}% slippage`);

      const orderResponse: OrderResponse = {
        orderId: response.orderId,
        symbol: order.symbol,
        side: order.side,
        quantity: order.quantity,
        price: response.price,
        status: response.status,
        executionTime,
        slippage
      };

      this.emit('orderExecuted', orderResponse);
      return orderResponse;

    } catch (error) {
      console.error('❌ Order execution failed:', error);
      throw error;
    }
  }

  // Get current market price with bid/ask spread
  private async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`${this.config.apiUrl}/ticker/24hr?symbol=${symbol}`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey
        }
      });
      
      const data = await response.json();
      return parseFloat(data.price);
    } catch (error) {
      console.error('Failed to get current price:', error);
      throw error;
    }
  }

  // Calculate optimal execution price to minimize slippage
  private calculateOptimalPrice(order: OrderRequest, currentPrice: number): number {
    if (order.type === 'MARKET') {
      // For market orders, use current price with minimal buffer
      const buffer = currentPrice * 0.0001; // 0.01% buffer
      return order.side === 'BUY' ? currentPrice + buffer : currentPrice - buffer;
    }
    
    return order.price || currentPrice;
  }

  // Send order to exchange via REST API
  private async sendOrderToExchange(order: OrderRequest): Promise<any> {
    const timestamp = Date.now();
    const params = new URLSearchParams({
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity.toString(),
      timestamp: timestamp.toString(),
      ...(order.price && { price: order.price.toString() }),
      ...(order.timeInForce && { timeInForce: order.timeInForce })
    });

    const signature = this.generateSignature(timestamp);
    params.append('signature', signature);

    const response = await fetch(`${this.config.apiUrl}/order`, {
      method: 'POST',
      headers: {
        'X-MBX-APIKEY': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      throw new Error(`Order failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Handle incoming WebSocket messages
  private handleMessage(message: any): void {
    if (message.e === '24hrTicker') {
      // Market data update
      const marketData: MarketData = {
        symbol: message.s,
        price: parseFloat(message.c),
        bid: parseFloat(message.b),
        ask: parseFloat(message.a),
        volume: parseFloat(message.v),
        timestamp: message.E
      };

      this.emit('marketData', marketData);
    } else if (message.e === 'executionReport') {
      // Order execution update
      this.emit('orderUpdate', {
        orderId: message.i,
        status: message.X,
        executedQuantity: parseFloat(message.z),
        price: parseFloat(message.p)
      });
    }
  }

  // Send message via WebSocket
  private send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // Auto-reconnect on disconnect
  private reconnect(): void {
    setTimeout(() => {
      if (!this.isConnected) {
        console.log('🔄 Attempting to reconnect...');
        this.connect().catch(console.error);
      }
    }, 5000);
  }

  // Get average execution time
  getAverageExecutionTime(): number {
    if (this.executionTimes.length === 0) return 0;
    return this.executionTimes.reduce((a, b) => a + b, 0) / this.executionTimes.length;
  }

  // Disconnect
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

// Broker configurations
export const BROKER_CONFIGS: Record<string, BrokerConfig> = {
  binance: {
    name: 'Binance',
    apiUrl: 'https://api.binance.com/api/v3',
    wsUrl: 'wss://stream.binance.com:9443/ws',
    testnet: false
  },
  binanceTestnet: {
    name: 'Binance Testnet',
    apiUrl: 'https://testnet.binance.vision/api/v3',
    wsUrl: 'wss://testnet.binance.vision/ws',
    testnet: true
  },
  bybit: {
    name: 'Bybit',
    apiUrl: 'https://api.bybit.com/v5',
    wsUrl: 'wss://stream.bybit.com/v5/public/linear',
    testnet: false
  },
  okx: {
    name: 'OKX',
    apiUrl: 'https://www.okx.com/api/v5',
    wsUrl: 'wss://ws.okx.com:8443/ws/v5/public',
    testnet: false
  }
};