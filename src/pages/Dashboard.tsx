import React, { useState } from 'react';
import { useTrading } from '../contexts/TradingContext';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, TrendingDown, Users, Activity, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { brokerAccounts, subscriptions, trades, isLoading } = useTrading();
  const { profile } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Calculate totals
  const totalBalance = brokerAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalPnL = brokerAccounts.reduce((sum, acc) => sum + acc.pnl, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.isActive).length;
  const masterAccounts = brokerAccounts.filter(acc => acc.accountType === 'MASTER');
  const followerAccounts = brokerAccounts.filter(acc => acc.accountType === 'FOLLOWER');

  // Calculate recent performance
  const recentTrades = trades.slice(0, 5);
  const winRate = trades.length > 0 
    ? (trades.filter(trade => trade.pnl > 0).length / trades.length) * 100 
    : 0;

  const stats = [
    {
      title: 'Total Balance',
      value: `$${totalBalance.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Total P&L',
      value: `$${totalPnL.toLocaleString()}`,
      change: totalPnL >= 0 ? '+8.3%' : '-2.1%',
      changeType: totalPnL >= 0 ? 'positive' as const : 'negative' as const,
      icon: TrendingUp,
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: Activity,
    },
  ];

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
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {profile?.firstName || 'Trader'}!
          </h1>
          <p className="text-gray-400">Here's your trading overview</p>
        </div>
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${
                stat.changeType === 'positive' ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.changeType === 'positive' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
              <span className="text-gray-400 text-sm ml-1">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Accounts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Master Accounts */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Master Accounts</h3>
          {masterAccounts.length === 0 ? (
            <p className="text-gray-400">No master accounts yet</p>
          ) : (
            <div className="space-y-3">
              {masterAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{account.name}</p>
                    <p className="text-sm text-gray-400">{account.broker}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">${account.balance.toLocaleString()}</p>
                    <p className={`text-sm ${account.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {account.pnl >= 0 ? '+' : ''}${account.pnl.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Follower Accounts */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Follower Accounts</h3>
          {followerAccounts.length === 0 ? (
            <p className="text-gray-400">No follower accounts yet</p>
          ) : (
            <div className="space-y-3">
              {followerAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{account.name}</p>
                    <p className="text-sm text-gray-400">{account.broker}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">${account.balance.toLocaleString()}</p>
                    <p className={`text-sm ${account.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {account.pnl >= 0 ? '+' : ''}${account.pnl.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
        {recentTrades.length === 0 ? (
          <p className="text-gray-400">No recent trades</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm">
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3">Side</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">P&L</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((trade) => (
                  <tr key={trade.id} className="border-t border-gray-700">
                    <td className="py-3 text-white font-medium">{trade.symbol}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.side === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">{trade.quantity}</td>
                    <td className="py-3 text-gray-300">${trade.price.toFixed(2)}</td>
                    <td className={`py-3 font-medium ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.status === 'EXECUTED' ? 'bg-green-500/20 text-green-400' :
                        trade.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-sm">
                      {new Date(trade.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;