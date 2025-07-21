import React, { useState } from 'react';
import { useTrading } from '../contexts/TradingContext';
import { X, Plus, Search } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, accountId }) => {
  const { addSubscription, subscriptions, accounts } = useTrading();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaster, setSelectedMaster] = useState('');
  const [multiplier, setMultiplier] = useState(1.0);
  const [maxPositionSize, setMaxPositionSize] = useState(10000);
  const [dailyLossLimit, setDailyLossLimit] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);

  // Mock master traders data
  const masterTraders = [
    {
      id: 'master-1',
      name: 'Expert Trader #1',
      broker: 'Delta Exchange',
      winRate: 78.5,
      monthlyReturn: 15.2,
      followers: 245,
      risk: 'Medium',
      pnl: 12500,
    },
    {
      id: 'master-2',
      name: 'Pro Scalper',
      broker: 'Binance Futures',
      winRate: 65.3,
      monthlyReturn: 22.1,
      followers: 156,
      risk: 'High',
      pnl: 8750,
    },
    {
      id: 'master-3',
      name: 'Conservative Trader',
      broker: 'Bybit',
      winRate: 82.1,
      monthlyReturn: 8.5,
      followers: 320,
      risk: 'Low',
      pnl: 6200,
    },
    {
      id: 'master-4',
      name: 'Crypto Bull',
      broker: 'OKX',
      winRate: 71.2,
      monthlyReturn: 18.7,
      followers: 198,
      risk: 'Medium',
      pnl: 9800,
    },
  ];

  const filteredMasters = masterTraders.filter(master =>
    master.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    master.broker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaster) return;

    setIsLoading(true);

    try {
      const master = masterTraders.find(m => m.id === selectedMaster);
      if (master) {
        addSubscription({
          masterAccountId: selectedMaster,
          masterName: master.name,
          multiplier,
          maxPositionSize,
          dailyLossLimit,
          isActive: true,
          pnl: 0,
          trades: 0,
        });
      }

      onClose();
    } catch (error) {
      console.error('Failed to add subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-gray-800 rounded-lg w-full max-w-4xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Manage Copy Trading Subscriptions</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Master Trader Selection */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Select Master Trader</h3>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search master traders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {filteredMasters.map((master) => (
                  <div
                    key={master.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMaster === master.id
                        ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                        : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedMaster(master.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{master.name}</h4>
                        <p className="text-sm text-gray-400">{master.broker}</p>
                      </div>
                      <span className={`text-sm font-medium ${getRiskColor(master.risk)}`}>
                        {master.risk} Risk
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Win Rate</p>
                        <p className="text-white font-medium">{master.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Monthly Return</p>
                        <p className="text-green-400 font-medium">+{master.monthlyReturn}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Followers</p>
                        <p className="text-white font-medium">{master.followers}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Configuration</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="multiplier" className="block text-sm font-medium text-gray-300 mb-1">
                    Multiplier (0.1x - 10x)
                  </label>
                  <input
                    type="number"
                    id="multiplier"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Your position size will be {multiplier}x the master's position
                  </p>
                </div>

                <div>
                  <label htmlFor="maxPosition" className="block text-sm font-medium text-gray-300 mb-1">
                    Max Position Size
                  </label>
                  <input
                    type="number"
                    id="maxPosition"
                    min="0"
                    step="100"
                    value={maxPositionSize}
                    onChange={(e) => setMaxPositionSize(parseInt(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum USD value for a single position
                  </p>
                </div>

                <div>
                  <label htmlFor="dailyLimit" className="block text-sm font-medium text-gray-300 mb-1">
                    Daily Loss Limit
                  </label>
                  <input
                    type="number"
                    id="dailyLimit"
                    min="0"
                    step="50"
                    value={dailyLossLimit}
                    onChange={(e) => setDailyLossLimit(parseInt(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Stop copying if daily loss exceeds this amount
                  </p>
                </div>

                {selectedMaster && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Master:</span>
                        <span className="text-white">
                          {masterTraders.find(m => m.id === selectedMaster)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Multiplier:</span>
                        <span className="text-white">{multiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Position:</span>
                        <span className="text-white">{formatCurrency(maxPositionSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Limit:</span>
                        <span className="text-white">{formatCurrency(dailyLossLimit)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedMaster || isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Adding...' : 'Add Subscription'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;