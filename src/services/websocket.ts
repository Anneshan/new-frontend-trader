import { API_CONFIG } from '../config/api';

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

export type WebSocketEventHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map();
  private isConnecting = false;
  private shouldReconnect = true;

  constructor() {
    // Don't auto-connect to prevent errors when backend is not available
    // this.connect();
  }

  private connect(): void {
    // Skip connection if no backend is available
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN) || !this.shouldConnect()) {
      return;
    }

    this.isConnecting = true;
    const token = localStorage.getItem('authToken');
    
    try {
      this.ws = new WebSocket(API_CONFIG.WS_URL);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Authenticate if token exists
        if (token) {
          this.send({
            type: 'auth',
            data: { token },
          });
        }

        this.emit('connected', {});
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.ws = null;
        this.emit('disconnected', { code: event.code, reason: event.reason });

        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private shouldConnect(): boolean {
    // Only connect if we have a real backend URL (not localhost in production)
    const wsUrl = API_CONFIG.WS_URL;
    if (wsUrl.includes('localhost') && window.location.hostname !== 'localhost') {
      return false;
    }
    return true;
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect();
      }
    }, delay);
  }

  private handleMessage(message: WebSocketMessage): void {
    const { type, data } = message;

    switch (type) {
      case 'welcome':
        console.log('WebSocket welcome:', data);
        break;
      case 'auth_success':
        console.log('WebSocket authenticated');
        this.emit('authenticated', data);
        break;
      case 'auth_error':
        console.error('WebSocket authentication failed:', data);
        this.emit('auth_error', data);
        break;
      case 'initial_data':
        this.emit('initial_data', data);
        break;
      case 'trade_update':
        this.emit('trade_update', data);
        break;
      case 'account_update':
        this.emit('account_update', data);
        break;
      case 'market_data':
        this.emit('market_data', data);
        break;
      case 'error':
        console.error('WebSocket error message:', data);
        this.emit('error', data);
        break;
      default:
        console.log('Unknown WebSocket message type:', type, data);
    }
  }

  public send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  public subscribe(channels: string[]): void {
    this.send({
      type: 'subscribe',
      data: { channels },
    });
  }

  public unsubscribe(channels: string[]): void {
    this.send({
      type: 'unsubscribe',
      data: { channels },
    });
  }

  public authenticate(token: string): void {
    this.send({
      type: 'auth',
      data: { token },
    });
  }

  public on(event: string, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  public off(event: string, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in WebSocket event handler:', error);
        }
      });
    }
  }

  public disconnect(): void {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public reconnect(): void {
    this.shouldReconnect = true;
    this.reconnectAttempts = 0;
    this.disconnect();
    setTimeout(() => this.connect(), 100);
  }

  public getConnectionState(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  public isConnected(): boolean {
    return this.ws ? this.ws.readyState === WebSocket.OPEN : false;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;