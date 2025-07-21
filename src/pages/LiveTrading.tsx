import React from 'react';
import BrokerSetup from '../components/BrokerSetup';
import { Zap, Shield, TrendingUp, Activity } from 'lucide-react';

const LiveTrading = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Live Trading with Zero Slippage
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Connect to real broker APIs and execute trades in milliseconds with advanced slippage protection
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Ultra-Fast Execution</h3>
          <p className="text-gray-400 text-sm">Orders executed in &lt;50ms with WebSocket technology</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Zero Slippage</h3>
          <p className="text-gray-400 text-sm">Advanced algorithms minimize price slippage</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Real-Time Data</h3>
          <p className="text-gray-400 text-sm">Live market data from multiple exchanges</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <Activity className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Multi-Exchange</h3>
          <p className="text-gray-400 text-sm">Binance, Bybit, OKX, and more</p>
        </div>
      </div>

      {/* Broker Setup Component */}
      <BrokerSetup />

      {/* Performance Stats */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-8 border border-blue-500/30">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400 mb-2">&lt;50ms</p>
            <p className="text-gray-300">Average Execution Time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400 mb-2">0.001%</p>
            <p className="text-gray-300">Average Slippage</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400 mb-2">99.9%</p>
            <p className="text-gray-300">Uptime</p>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Getting Started</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">
              1
            </div>
            <div>
              <h4 className="text-white font-medium">Create API Keys</h4>
              <p className="text-gray-400 text-sm">
                Generate API keys from your broker (Binance, Bybit, etc.) with trading permissions only
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">
              2
            </div>
            <div>
              <h4 className="text-white font-medium">Connect Your Broker</h4>
              <p className="text-gray-400 text-sm">
                Enter your API credentials above to establish a real-time connection
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">
              3
            </div>
            <div>
              <h4 className="text-white font-medium">Start Trading</h4>
              <p className="text-gray-400 text-sm">
                Use the quick trade buttons or set up automated copy trading strategies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrading;