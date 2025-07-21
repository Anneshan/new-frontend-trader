import React, { useState } from 'react';
import { BROKER_CONFIGS } from '../services/brokerAPI';
import { useBrokerAPI } from '../hooks/useBrokerAPI';
import { Zap, Shield, TrendingUp, Activity, Eye, EyeOff } from 'lucide-react';

const BrokerSetup = () => {
  const [selectedBroker, setSelectedBroker] = useState('binanceTestnet');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  const config = BROKER_CONFIGS[selectedBroker];
  const { 
    isConnected, 
    marketData, 
    orders, 
    averageExecutionTime,
    subscribeToSymbols,
    executeOrder,
    getCurrentPrice,
    getSpread 
  } = useBrokerAPI(config, apiKey, apiSecret);

  const handleSetup = () => {
    if (apiKey && apiSecret) {
      setIsSetup(true);
      // Subscribe to popular trading pairs
      subscribeToSymbols(['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT']);
    }
  };

  const handleQuickTrade = async (symbol: string, side: 'BUY' | 'SELL') => {
    try {
      const currentPrice = getCurrentPrice(symbol);
      if (!currentPrice) {
        alert('Price data not available');
        return;
      }

      await executeOrder({
        symbol,
        side,
        type: 'MARKET',
        quantity: side === 'BUY' ? 100 / currentPrice : 0.001, // $100 worth or 0.001 BTC
        timeInForce: 'IOC' // Immediate or Cancel for zero slippage
      });

      alert(`${side} order executed successfully!`);
    } catch (error) {
      console.error('Trade failed:', error);
      alert('Trade failed: ' + error.message);
    }
  };

  if (!isSetup) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg border border-gray-700">
        <div className="text-center mb-8">
          <Zap className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Real-Time Broker Setup</h2>
          <p className="text-gray-300">Connect to live markets with zero slippage execution</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Broker
            </label>
            <select
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(BROKER_CONFIGS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name} {config.testnet ? '(Testnet - Safe for Testing)' : '(Live Trading)'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Secret
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Enter your API secret"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="text-blue-300 font-medium">Security Notice</h3>
            </div>
            <p className="text-blue-200 text-sm">
              Your API keys are encrypted and never stored. We recommend using testnet for initial testing.
              For live trading, ensure your API keys have only trading permissions (no withdrawal).
            </p>
          </div>

          <button
            onClick={handleSetup}
            disabled={!apiKey || !apiSecret}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Connect to {config.name}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <h2 className="text-xl font-semibold text-white">
              {config.name} {isConnected ? 'Connected' : 'Disconnected'}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Avg Execution Time</p>
            <p className="text-lg font-bold text-green-400">{averageExecutionTime.toFixed(2)}ms</p>
          </div>
        </div>
      </div>

      {/* Live Market Data */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-400" />
          Live Market Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(marketData).map(([symbol, data]) => (
            <div key={symbol} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{symbol}</h4>
                <span className="text-xs text-gray-400">Live</span>
              </div>
              <p className="text-2xl font-bold text-white">${data.price.toFixed(2)}</p>
              <p className="text-sm text-gray-400">
                Spread: {getSpread(symbol)?.toFixed(3)}%
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleQuickTrade(symbol, 'BUY')}
                  className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  BUY
                </button>
                <button
                  onClick={() => handleQuickTrade(symbol, 'SELL')}
                  className="flex-1 bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  SELL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
          Recent Orders
        </h3>
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{order.symbol} {order.side}</p>
                  <p className="text-sm text-gray-400">
                    {order.quantity} @ ${order.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-400">
                    {order.executionTime.toFixed(2)}ms
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.slippage.toFixed(4)}% slippage
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">No orders yet. Try the quick trade buttons above!</p>
        )}
      </div>
    </div>
  );
};

export default BrokerSetup;