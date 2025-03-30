import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useWeb3 } from '@/context/Web3Context';
import { useToken } from '@/hooks/useToken';
import { ethers } from 'ethers';

interface Transaction {
  hash: string;
  type: 'stake' | 'unstake' | 'claim' | 'buy' | 'sell';
  amount: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}

export default function Profile() {
  const { account, provider } = useWeb3();
  const { balanceOf } = useToken();
  const [balance, setBalance] = useState('0');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      loadUserData();
    }
  }, [account]);

  const loadUserData = async () => {
    if (!account) return;

    try {
      setLoading(true);
      const userBalance = await balanceOf(account);
      setBalance(userBalance);

      // In a real application, you would fetch transaction history from your backend
      // For now, we'll use mock data
      const mockTransactions: Transaction[] = [
        {
          hash: '0x123...abc',
          type: 'stake',
          amount: '1000 BDT',
          timestamp: Date.now() - 86400000, // 1 day ago
          status: 'completed',
        },
        {
          hash: '0x456...def',
          type: 'claim',
          amount: '50 BDT',
          timestamp: Date.now() - 172800000, // 2 days ago
          status: 'completed',
        },
        {
          hash: '0x789...ghi',
          type: 'buy',
          amount: '500 BDT',
          timestamp: Date.now() - 259200000, // 3 days ago
          status: 'completed',
        },
      ];

      setTransactions(mockTransactions);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTransactionTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'stake':
        return 'text-green-600';
      case 'unstake':
        return 'text-red-600';
      case 'claim':
        return 'text-blue-600';
      case 'buy':
        return 'text-purple-600';
      case 'sell':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h2>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {/* Account Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-900/5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Account Information</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Wallet Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Token Balance</p>
                  <p className="text-lg font-medium text-gray-900">{balance} BDT</p>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-900/5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Transaction History</h3>
              <div className="mt-4">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                  <p className="text-sm text-gray-500">No transactions found</p>
                ) : (
                  <div className="flow-root">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <li key={transaction.hash} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatTimestamp(transaction.timestamp)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`text-sm font-medium ${getTransactionTypeColor(transaction.type)}`}>
                                {transaction.amount}
                              </span>
                              <span className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 