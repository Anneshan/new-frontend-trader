import React, { useState } from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Plus, Edit, Trash2, Eye, TrendingUp, Users, Activity } from 'lucide-react';
import AddAccountModal from '../components/AddAccountModal';

const MasterAccounts: React.FC = () => {
  const { brokerAccounts, deleteBrokerAccount, isLoading } = useTrading();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const masterAccounts = brokerAccounts.filter(acc => acc.accountType === 'MASTER');

  const handleDeleteAccount = async (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      const result = await deleteBrokerAccount(accountId);
      if (!result.success) {
        alert('Failed to delete account: ' + result.error);
      }
    }
  };

  const getBrokerIcon = (broker: string) => {
    switch (broker) {
      case 'BINANCE': return '🟡';
      case 'BYBIT': return '🟠';
      case 'DELTA': return '🔺';
      case 'OKX': return '⚪';
      default: return '📊';
    }
  };

  const getBrokerColor = (broker: string) => {
    switch (broker) {
      case 'BINANCE': return 'text-yellow-400';
      case 'BYBIT': return 'text-orange-400';
      case 'DELTA': return 'text-blue-400';
      case 'OKX': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Master Accounts</h1>
          <p className="text-gray-400">Manage your master trading accounts</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Master Account</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Total P&L</dt>
                <dd className="text-lg font-medium text-white">
                  ${masterAccounts.reduce((sum, acc) => sum + acc.pnl, 0).toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Total Followers</dt>
                <dd className="text-lg font-medium text-white">
                  {masterAccounts.reduce((sum, acc) => sum + (acc as any).followers || 0, 0)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Active Accounts</dt>
                <dd className="text-lg font-medium text-white">
                  {masterAccounts.filter(acc => acc.isActive).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Your Master Accounts</h2>
        </div>
        
        {masterAccounts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No master accounts yet</p>
              <p className="text-sm">Create your first master account to start copy trading</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Master Account
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {masterAccounts.map((account) => (
              <div key={account.id} className="p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl ${getBrokerColor(account.broker)}`}>
                      {getBrokerIcon(account.broker)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{account.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{account.broker.toLowerCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Balance</p>
                      <p className="text-lg font-medium text-white">${account.balance.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">P&L</p>
                      <p className={`text-lg font-medium ${account.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {account.pnl >= 0 ? '+' : ''}${account.pnl.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAccount(account.id)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        title="Edit Account"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        title="Delete Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {selectedAccount === account.id && (
                  <div className="mt-4 p-4 bg-gray-750 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Status</p>
                        <p className={`font-medium ${account.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Last Sync</p>
                        <p className="text-white">
                          {new Date(account.lastSync).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Created</p>
                        <p className="text-white">
                          {new Date(account.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Win Rate</p>
                        <p className="text-white">
                          {(account as any).winRate ? `${(account as any).winRate}%` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        accountType="MASTER"
      />
    </div>
  );
};

export default MasterAccounts;