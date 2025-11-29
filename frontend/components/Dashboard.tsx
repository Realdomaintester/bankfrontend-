/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useCallback } from 'react';
import { BANK_INFO, accounts } from '../api';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  CreditCardIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Account } from '../types';
import { PayBillModal } from './PayBillModal';
import { TransferModal } from './TransferModal';

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = () => {
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);
  const [totalCheckingBalance, setTotalCheckingBalance] = useState(0);
  const [totalSavingsBalance, setTotalSavingsBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal States
  const [isPayBillModalOpen, setIsPayBillModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const fetchAccountBalances = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedAccounts = await accounts.getAccounts();
      setUserAccounts(fetchedAccounts);
      const checking = fetchedAccounts
        .filter((acc) => acc.type === 'checking')
        .reduce((sum, acc) => sum + acc.balance, 0);
      const savings = fetchedAccounts
        .filter((acc) => acc.type === 'savings')
        .reduce((sum, acc) => sum + acc.balance, 0);
      setTotalCheckingBalance(checking);
      setTotalSavingsBalance(savings);
    } catch (err) {
      console.error('Failed to fetch account balances:', err);
      setError('Failed to load account balances.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountBalances();
  }, [fetchAccountBalances]);

  const handleTransactionSuccess = () => {
    setIsPayBillModalOpen(false);
    setIsTransferModalOpen(false);
    fetchAccountBalances();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-zinc-100">
        Welcome, {BANK_INFO.profileName}
      </h1>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-blue-400">
          <svg className="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading your dashboard...
        </div>
      ) : error ? (
        <div className="card bg-red-900/20 border-red-800 text-red-300 p-4 mb-8">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="card flex flex-col justify-between">
            <div className="flex items-center space-x-3 mb-4">
              <BanknotesIcon className="w-8 h-8 text-blue-400" />
              <h2 className="text-xl font-semibold text-zinc-200">Total Holdings</h2>
            </div>
            <p className="text-4xl font-bold text-green-400 mb-2">
              {formatCurrency(totalCheckingBalance + totalSavingsBalance - (userAccounts.find(acc => acc.type === 'credit_card')?.balance || 0))}
            </p>
            <p className="text-zinc-400 text-sm">Across all linked accounts</p>
          </div>

          {/* Recent Transactions Card */}
          <div className="card flex flex-col justify-between">
            <div className="flex items-center space-x-3 mb-4">
              <ArrowTrendingUpIcon className="w-8 h-8 text-yellow-400" />
              <h2 className="text-xl font-semibold text-zinc-200">Recent Activity</h2>
            </div>
            <p className="text-3xl font-bold text-zinc-100 mb-2">
              {formatCurrency(BANK_INFO.recentTransactionsSummary)}
            </p>
            <p className="text-zinc-400 text-sm">Total transactions over last 6 months</p>
          </div>

          {/* Quick Actions / Profile Card */}
          <div className="card flex flex-col justify-between row-span-2 lg:row-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <UserCircleIcon className="w-8 h-8 text-purple-400" />
              <h2 className="text-xl font-semibold text-zinc-200">Your Profile</h2>
            </div>
            <div className="space-y-3">
              <p className="text-lg text-zinc-100 font-medium">Howard Woods</p>
              <p className="text-zinc-400 text-sm">Customer ID: {BANK_INFO.profileName.toLowerCase().replace(' ', '')}-123</p>
              <Link to="/profile" className="text-blue-400 hover:underline flex items-center space-x-1">
                <span>View Full Profile</span>
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Checking Accounts Summary */}
          <div className="card flex flex-col justify-between">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCardIcon className="w-8 h-8 text-orange-400" />
              <h2 className="text-xl font-semibold text-zinc-200">Checking Accounts</h2>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {formatCurrency(totalCheckingBalance)}
            </p>
            <p className="text-zinc-400 text-sm">2 accounts linked</p>
          </div>

          {/* Savings Accounts Summary */}
          <div className="card flex flex-col justify-between">
            <div className="flex items-center space-x-3 mb-4">
              <BanknotesIcon className="w-8 h-8 text-cyan-400" />
              <h2 className="text-xl font-semibold text-zinc-200">Savings Account</h2>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {formatCurrency(totalSavingsBalance)}
            </p>
            <p className="text-zinc-400 text-sm">1 account linked</p>
          </div>
        </div>
      )}

      {/* Main Actions */}
      <div className="card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <Link to="/accounts" className="button-primary flex items-center justify-center space-x-2 p-4 text-lg">
          <ArrowUpTrayIcon className="w-6 h-6" />
          <span>Deposit</span>
        </Link>
        <Link to="/accounts" className="button-primary flex items-center justify-center space-x-2 p-4 text-lg">
          <ArrowDownTrayIcon className="w-6 h-6" />
          <span>Withdraw</span>
        </Link>
        <button 
          onClick={() => setIsTransferModalOpen(true)}
          className="button-primary flex items-center justify-center space-x-2 p-4 text-lg"
        >
          <ArrowPathIcon className="w-6 h-6" />
          <span>Transfer</span>
        </button>
        <button
          onClick={() => setIsPayBillModalOpen(true)}
          className="button-primary flex items-center justify-center space-x-2 p-4 text-lg"
        >
          <ReceiptPercentIcon className="w-6 h-6" />
          <span>Pay Bills</span>
        </button>
      </div>

      <p className="mt-8 text-center text-zinc-600 text-sm">
        Fraud detection systems active. Your transactions are continuously monitored.
      </p>

      {/* Modals */}
      <PayBillModal
        isOpen={isPayBillModalOpen}
        onClose={() => setIsPayBillModalOpen(false)}
        onPaymentSuccess={handleTransactionSuccess}
        accounts={userAccounts.filter(acc => acc.type === 'checking' || acc.type === 'savings')}
      />
      
      <TransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={handleTransactionSuccess}
        userAccounts={userAccounts}
      />
    </div>
  );
};