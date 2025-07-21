import { useState, useEffect, useCallback } from 'react';
import { RealTimeBrokerAPI, BrokerConfig, OrderRequest, OrderResponse, MarketData } from '../services/brokerAPI';

interface BrokerAPIState {
  isConnected: boolean;
  marketData: Record<string, MarketData>;
  orders: OrderResponse[];
  averageExecutionTime: number;
  totalSlippage: number;
}

export const useBrokerAPI = (config: BrokerConfig, apiKey: string, apiSecret: string) => {
  const [brokerAPI, setBrokerAPI] = useState<RealTimeBrokerAPI | null>(null);
  const [state, setState] = useState<BrokerAPIState>({
    isConnected: false,
    marketData: {},
    orders: [],
    averageExecutionTime: 0,
    totalSlippage: 0
  });

  // Initialize broker API
  useEffect(() => {
    if (apiKey && apiSecret) {
      const api = new RealTimeBrokerAPI(config, apiKey, apiSecret);
      setBrokerAPI(api);

      // Set up event listeners
      api.on('marketData', (data: MarketData) => {
        setState(prev => ({
          ...prev,
          marketData: {
            ...prev.marketData,
            [data.symbol]: data
          }
        }));
      });

      api.on('orderExecuted', (order: OrderResponse) => {
        setState(prev => ({
          ...prev,
          orders: [order, ...prev.orders],
          averageExecutionTime: api.getAverageExecutionTime(),
          totalSlippage: prev.totalSlippage + order.slippage
        }));
      });

      // Connect to broker
      api.connect()
        .then(() => {
          setState(prev => ({ ...prev, isConnected: true }));
          console.log('✅ Broker API connected successfully');
        })
        .catch(error => {
          console.error('❌ Failed to connect to broker API:', error);
        });

      return () => {
        api.disconnect();
      };
    }
  }, [config, apiKey, apiSecret]);

  // Subscribe to market data
  const subscribeToSymbols = useCallback((symbols: string[]) => {
    if (brokerAPI && state.isConnected) {
      brokerAPI.subscribeToMarketData(symbols);
    }
  }, [brokerAPI, state.isConnected]);

  // Execute order with zero slippage protection
  const executeOrder = useCallback(async (order: OrderRequest): Promise<OrderResponse> => {
    if (!brokerAPI) {
      throw new Error('Broker API not initialized');
    }

    console.log(`⚡ Executing ${order.side} order for ${order.quantity} ${order.symbol}`);
    return await brokerAPI.executeOrder(order);
  }, [brokerAPI]);

  // Get current price for a symbol
  const getCurrentPrice = useCallback((symbol: string): number | null => {
    const data = state.marketData[symbol];
    return data ? data.price : null;
  }, [state.marketData]);

  // Get bid/ask spread
  const getSpread = useCallback((symbol: string): number | null => {
    const data = state.marketData[symbol];
    return data ? ((data.ask - data.bid) / data.price) * 100 : null;
  }, [state.marketData]);

  return {
    ...state,
    subscribeToSymbols,
    executeOrder,
    getCurrentPrice,
    getSpread,
    brokerAPI
  };
};