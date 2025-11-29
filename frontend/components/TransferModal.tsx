/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Account } from '../types';
import { accounts } from '../api';
import {
  XMarkIcon,
  BanknotesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userAccounts: Account[];
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userAccounts,
}) => {
  const [fromAccountId, setFromAccountId] = useState<string>('');
  const [toAccountId, setToToAccountId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userAccounts.length > 0) {
      setFromAccountId(userAccounts[0].id);
      // Default to the second account if available, otherwise empty
      setToToAccountId(userAccounts.length > 1 ? userAccounts[1].id : '');
      setAmount('');
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, userAccounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (fromAccountId === toAccountId) {
      setError('Cannot transfer to the same account.');
      return;
    }

    setLoading(true);
    try {
      await accounts.transfer(fromAccountId, toAccountId, val);
      setSuccessMsg(`Successfully transferred $${val.toFixed(2)}.`);
      setTimeout(() => {
        onSuccess(); // Close modal and refresh data
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="card w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100"
          disabled={loading}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
          <BanknotesIcon className="w-7 h-7 text-blue-400" />
          Transfer Funds
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* From Account */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">From</label>
              <select
                className="input-field cursor-pointer"
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                disabled={loading}
              >
                {userAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (${acc.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:flex justify-center text-zinc-500 mt-6">
              <ArrowRightIcon className="w-6 h-6" />
            </div>

            {/* To Account */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">To</label>
              <select
                className="input-field cursor-pointer"
                value={toAccountId}
                onChange={(e) => setToToAccountId(e.target.value)}
                disabled={loading}
              >
                {userAccounts
                  .filter((acc) => acc.id !== fromAccountId)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (${acc.balance.toLocaleString()})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
              <input
                type="text"
                className="input-field pl-8"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                   if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
                }}
                disabled={loading}
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={loading || !fromAccountId || !toAccountId || !amount}
            className="button-primary w-full flex justify-center items-center gap-2"
          >
            {loading ? 'Processing...' : 'Transfer Now'}
          </button>
        </form>

        {successMsg && (
          <div className="absolute inset-0 bg-zinc-900/90 flex flex-col items-center justify-center rounded-lg">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-xl font-semibold text-white">{successMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
};