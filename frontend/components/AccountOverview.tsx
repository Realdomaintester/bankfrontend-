/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { accounts, transactions } from '../api';
import { Account, Transaction } from '../types';
import {
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  ArrowRightCircleIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

type ActionType = 'deposit' | 'withdraw' | null;

export const AccountOverview: React.FC = () => {
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountTransactions, setAccountTransactions] = useState<Transaction[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  // Action State
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [actionAmount, setActionAmount] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchData = async (keepSelection = true) => {
    try {
      // Fetch Accounts
      const fetchedAccounts = await accounts.getAccounts();
      setUserAccounts(fetchedAccounts);
      
      // Handle Selection
      if (keepSelection && selectedAccount) {
         // Update the selected account object with new balance
         const updatedSelected = fetchedAccounts.find(a => a.id === selectedAccount.id);
         if (updatedSelected) setSelectedAccount(updatedSelected);
      } else if (fetchedAccounts.length > 0) {
        setSelectedAccount(fetchedAccounts[0]);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to refresh data.');
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  useEffect(() => {
    const fetchTrans = async () => {
      if (selectedAccount) {
        try {
          setLoadingTransactions(true);
          const fetchedTransactions = await transactions.getTransactions(selectedAccount.id);
          setAccountTransactions(fetchedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (err) {
          console.error('Failed to fetch transactions:', err);
          setError('Failed to load transactions for the selected account.');
        } finally {
          setLoadingTransactions(false);
        }
      } else {
        setAccountTransactions([]);
      }
    };
    fetchTrans();
  }, [selectedAccount]);

  // Filter transactions based on search term and type
  const filteredTransactions = accountTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !activeAction) return;
    
    setActionError(null);
    setActionSuccess(null);
    
    const amount = parseFloat(actionAmount);
    if (isNaN(amount) || amount <= 0) {
      setActionError('Please enter a valid positive amount.');
      return;
    }

    setActionLoading(true);
    try {
      if (activeAction === 'deposit') {
        await accounts.deposit(selectedAccount.id, amount);
        setActionSuccess(`Successfully deposited ${formatCurrency(amount, selectedAccount.currency)}`);
      } else {
        await accounts.withdraw(selectedAccount.id, amount);
        setActionSuccess(`Successfully withdrew ${formatCurrency(amount, selectedAccount.currency)}`);
      }
      
      // Reset form and refresh data
      setActionAmount('');
      await fetchData(true); // Refresh accounts to show new balance
      
      // Clear success message after a delay or let user close
      setTimeout(() => setActionSuccess(null), 3000);

    } catch (err: any) {
      setActionError(err.message || 'Transaction failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <WalletIcon className="w-6 h-6 text-blue-400" />;
      case 'savings':
        return <BanknotesIcon className="w-6 h-6 text-green-400" />;
      case 'credit_card':
        return <CreditCardIcon className="w-6 h-6 text-purple-400" />;
      default:
        return <ArrowRightCircleIcon className="w-6 h-6 text-zinc-400" />;
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-zinc-100">Your Accounts</h1>

      {loadingAccounts ? (
        <div className="flex items-center justify-center h-48 text-blue-400">
          <svg
            className="animate-spin h-8 w-8 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading your accounts...
        </div>
      ) : error ? (
        <div className="card bg-red-900/20 border-red-800 text-red-300 p-4 mb-8">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account List */}
          <div className="lg:col-span-1">
            <div className="card h-full p-6">
              <h2 className="text-2xl font-semibold mb-6 text-zinc-100">All Accounts</h2>
              <ul className="space-y-4">
                {userAccounts.map((account) => (
                  <li key={account.id}>
                    <button
                      onClick={() => {
                        setSelectedAccount(account);
                        setActiveAction(null); // Reset action when switching accounts
                        setActionAmount('');
                        setActionError(null);
                        setActionSuccess(null);
                        setSearchTerm('');
                        setFilterType('all');
                      }}
                      className={`w-full text-left p-4 flex items-center space-x-4 rounded-lg transition-colors ${
                        selectedAccount?.id === account.id
                          ? 'bg-blue-900/40 border border-blue-600 text-blue-100'
                          : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {getAccountIcon(account.type)}
                      <div className="flex-1">
                        <p className="font-medium">{account.name}</p>
                        <p className="text-sm text-zinc-400 capitalize">{account.type.replace('_', ' ')}</p>
                      </div>
                      <p className="font-bold text-lg">
                        {formatCurrency(account.balance, account.currency)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Account Details & Transactions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              {selectedAccount ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-zinc-700 gap-4">
                    <div className="flex items-center space-x-4">
                      {getAccountIcon(selectedAccount.type)}
                      <div>
                        <h2 className="text-3xl font-bold text-zinc-100">
                          {selectedAccount.name}
                        </h2>
                        <p className="text-blue-400 text-lg font-medium capitalize">
                          {selectedAccount.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-400 text-sm">Current Balance</p>
                      <p className="text-4xl font-extrabold text-white">
                        {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions Section */}
                  <div className="mb-8">
                     <h3 className="text-lg font-semibold mb-3 text-zinc-200">Quick Actions</h3>
                     
                     {!activeAction ? (
                        <div className="flex space-x-4">
                           <button 
                             onClick={() => setActiveAction('deposit')}
                             className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-zinc-200 transition-colors"
                           >
                             <ArrowDownTrayIcon className="w-5 h-5 text-green-400" />
                             <span>Deposit</span>
                           </button>
                           <button 
                             onClick={() => setActiveAction('withdraw')}
                             className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-zinc-200 transition-colors"
                           >
                             <ArrowUpTrayIcon className="w-5 h-5 text-red-400" />
                             <span>Withdraw</span>
                           </button>
                        </div>
                     ) : (
                       <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-semibold text-zinc-200 capitalize flex items-center gap-2">
                              {activeAction === 'deposit' ? <ArrowDownTrayIcon className="w-5 h-5 text-green-400"/> : <ArrowUpTrayIcon className="w-5 h-5 text-red-400"/>}
                              {activeAction} Funds
                            </h4>
                            <button onClick={() => setActiveAction(null)} className="text-zinc-400 hover:text-white">
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <form onSubmit={handleActionSubmit} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                             <div className="w-full sm:max-w-xs">
                               <label className="block text-xs text-zinc-400 mb-1">Amount ({selectedAccount.currency})</label>
                               <input 
                                 type="text" 
                                 value={actionAmount}
                                 onChange={(e) => {
                                   if (/^\d*\.?\d*$/.test(e.target.value)) setActionAmount(e.target.value);
                                 }}
                                 placeholder="0.00"
                                 className="input-field"
                                 disabled={actionLoading}
                               />
                             </div>
                             <button 
                               type="submit" 
                               disabled={actionLoading || !actionAmount}
                               className={`button-primary ${actionLoading ? 'opacity-70' : ''}`}
                             >
                               {actionLoading ? 'Processing...' : 'Submit Transaction'}
                             </button>
                          </form>
                          
                          {actionError && (
                            <p className="text-red-400 text-sm mt-2">{actionError}</p>
                          )}
                          {actionSuccess && (
                             <p className="text-green-400 text-sm mt-2">{actionSuccess}</p>
                          )}
                       </div>
                     )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="text-xl font-semibold text-zinc-100">Transaction History</h3>
                    
                    {/* Filters */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                          type="text" 
                          placeholder="Search transactions..." 
                          className="input-field py-2 pl-9 text-sm w-full sm:w-48"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <select 
                          className="input-field py-2 pl-9 text-sm appearance-none pr-8 cursor-pointer"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value as any)}
                        >
                          <option value="all">All Types</option>
                          <option value="credit">Deposits/Income</option>
                          <option value="debit">Withdrawals/Expenses</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {loadingTransactions ? (
                    <div className="flex items-center justify-center h-24 text-blue-400">
                      <svg
                        className="animate-spin h-6 w-6 mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading transactions...
                    </div>
                  ) : filteredTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr className="bg-zinc-800 text-zinc-400 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Date</th>
                            <th className="py-3 px-6 text-left">Description</th>
                            <th className="py-3 px-6 text-left">Type</th>
                            <th className="py-3 px-6 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="text-zinc-300 text-sm font-light">
                          {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-zinc-700 hover:bg-zinc-800">
                              <td className="py-3 px-6 text-left whitespace-nowrap">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-6 text-left">
                                {transaction.description}
                              </td>
                              <td className="py-3 px-6 text-left capitalize">
                                <span
                                  className={`py-1 px-3 rounded-full text-xs font-semibold ${
                                    transaction.type === 'credit'
                                      ? 'bg-green-700/30 text-green-400'
                                      : 'bg-red-700/30 text-red-400'
                                  }`}
                                >
                                  {transaction.type}
                                </span>
                              </td>
                              <td
                                className={`py-3 px-6 text-right font-medium ${
                                  transaction.type === 'credit' ? 'text-green-300' : 'text-red-300'
                                }`}
                              >
                                {formatCurrency(transaction.amount, selectedAccount.currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-center py-8">
                      {searchTerm || filterType !== 'all' 
                        ? 'No transactions match your filters.' 
                        : 'No transactions found for this account.'}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-zinc-500 text-center py-12">Select an account to view its details and transaction history.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
