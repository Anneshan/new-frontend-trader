import React, { useState } from 'react';
import { useTrading } from '../contexts/TradingContext';
import { X, Eye, EyeOff } from 'lucide-react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: 'MASTER' | 'FOLLOWER';
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, accountType }) => {
  const { addBrokerAccount } = useTrading();
  const [formData, setFormData] = useState({
    name: '',
    broker: 'BINANCE' as 'DELTA' | 'BINANCE' | 'BYBIT' | 'OKX',
    apiKey: '',
    apiSecret: '',
  });
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await addBrokerAccount({
        broker: formData.broker,
        accountType,
        name: formData.name,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        isActive: true,
        balance: 0,
        pnl: 0,
        lastSync: new Date().toISOString(),
      });

      if (result.success) {
        setFormData({ name: '', broker: 'BINANCE', apiKey: '', apiSecret: '' });
        onClose();
      } else {
        setError(result.error || 'Failed to add account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Add {accountType === 'MASTER' ? 'Master' : 'Follower'} Account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Account Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`${accountType === 'MASTER' ? 'Master' : 'Follower'} Account Name`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Broker
            </label>
            <select
              name="broker"
              value={formData.broker}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="BINANCE">Binance</option>
              <option value="BYBIT">Bybit</option>
              <option value="DELTA">Delta Exchange</option>
              <option value="OKX">OKX</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your API key"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Secret
            </label>
            <div className="relative">
              <input
                type={showApiSecret ? 'text' : 'password'}
                name="apiSecret"
                value={formData.apiSecret}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your API secret"
                required
              />
              <button
                type="button"
                onClick={() => setShowApiSecret(!showApiSecret)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showApiSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-900 border border-blue-700 rounded-md p-3">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-100">Security Notice</h3>
                <div className="mt-2 text-sm text-blue-200">
                  <p>Your API keys are encrypted with AES-256 encryption and stored securely. We never store or log your private keys.</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;