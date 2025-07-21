import React, { useState, useEffect } from 'react';
import { useTrading } from '../contexts/TradingContext';
import { X, TrendingUp, AlertTriangle } from 'lucide-react';

interface MultiplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
}

const MultiplierModal: React.FC<MultiplierModalProps> = ({ isOpen, onClose, subscriptionId }) => {
  const { subscriptions, updateSubscription } = useTrading();
  const [multiplier, setMultiplier] = useState(1.0);
  const [maxPositionSize, setMaxPositionSize] = useState(10000);
  const [dailyLossLimit, setDailyLossLimit] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const subscription = subscriptions.find(sub => sub.id === subscriptionId);

  useEffect(() => {
    if (subscription) {
      setMultiplier(subscription.multiplier);
      setMaxPositionSize(subscription.maxPositionSize);
      setDailyLossLimit(subscription.dailyLossLimit);
    }
  }, [subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (multiplier < 0.1 || multiplier > 10) {
      setError('Multiplier must be between 0.1x and 10x');
      setIsLoading(false);
      return;
    }

    if (maxPositionSize < 100) {
      setError('Max position size must be at least $100');
      setIsLoading(false);
      return;
    }

    if (dailyLossLimit < 50) {
      setError('Daily loss limit must be at least $50');
      setIsLoading(false);
      return;
    }

    try {
      await updateSubscription(subscriptionId, {
        multiplier,
        maxPositionSize,
        dailyLossLimit,
      });

      onClose();
    } catch (error) {
      console.error('Failed to update subscription:', error);
      setError('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateRisk = () => {
    if (multiplier <= 1) return { level: 'Low', color: 'text-green-400' };
    if (multiplier <= 3) return { level: 'Medium', color: 'text-yellow-400' };
    return { level: 'High', color: 'text-red-400' };
  };

  const risk = calculateRisk();

  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-gray-800 rounded-lg w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Edit Copy Trading Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-700 rounded-lg">
            <h3 className="text-white font-medium">{subscription.masterName}</h3>
            <p className="text-sm text-gray-400">Current Settings</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            </div>
          )}

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
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400">
                  Your position size will be {multiplier}x the master's position
                </p>
                <span className={`text-xs font-medium ${risk.color}`}>
                  {risk.level} Risk
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="maxPosition" className="block text-sm font-medium text-gray-300 mb-1">
                Max Position Size
              </label>
              <input
                type="number"
                id="maxPosition"
                min="100"
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
                min="50"
                step="50"
                value={dailyLossLimit}
                onChange={(e) => setDailyLossLimit(parseInt(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Stop copying if daily loss exceeds this amount
              </p>
            </div>

            <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-400 mr-2" />
                <h4 className="text-blue-100 font-medium">Updated Settings Preview</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Multiplier:</span>
                  <span className="text-white font-medium">{multiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Max Position:</span>
                  <span className="text-white font-medium">{formatCurrency(maxPositionSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Daily Limit:</span>
                  <span className="text-white font-medium">{formatCurrency(dailyLossLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Risk Level:</span>
                  <span className={`font-medium ${risk.color}`}>{risk.level}</span>
                </div>
              </div>
            </div>

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
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MultiplierModal;