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
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface PayBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  accounts: Account[]; // List of accounts the user can pay from
}

export const PayBillModal: React.FC<PayBillModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  accounts: availableAccounts,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>(''); // Use string for input to handle decimal smoothly
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setRecipient('');
      setAmount('');
      setToastMessage(null); // Clear toast message when modal opens
      if (availableAccounts.length > 0) {
        setSelectedAccountId(availableAccounts[0].id); // Pre-select first available account
      } else {
        setSelectedAccountId('');
      }
    }
  }, [isOpen, availableAccounts]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setToastMessage(null);

    const parsedAmount = parseFloat(amount);

    if (!selectedAccountId) {
      setError('Please select an account.');
      return;
    }
    if (!recipient.trim()) {
      setError('Recipient cannot be empty.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    setLoading(true);
    try {
      await accounts.payBill(selectedAccountId, recipient, parsedAmount);
      setToastMessage(`Bill payment to ${recipient} for $${parsedAmount.toFixed(2)} successful.`);
      setTimeout(() => {
        setToastMessage(null);
        onPaymentSuccess(); // Notify parent component of success and close modal after toast
      }, 3000); // Show toast for 3 seconds
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during bill payment.');
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
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="Close"
          disabled={loading} // Disable close button while loading
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-zinc-100 mb-6">Pay a Bill</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account Selection */}
          <div>
            <label htmlFor="paymentAccount" className="block text-zinc-300 text-sm font-medium mb-2">
              Pay from Account
            </label>
            <div className="relative">
              <BanknotesIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <select
                id="paymentAccount"
                className="input-field pl-10 appearance-none bg-zinc-800 focus:border-blue-400 cursor-pointer"
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                disabled={loading}
                required
              >
                {availableAccounts.length === 0 && (
                  <option value="" disabled>No accounts available</option>
                )}
                {availableAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.type.replace('_', ' ').toUpperCase()}) -{' '}
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label htmlFor="recipient" className="block text-zinc-300 text-sm font-medium mb-2">
              Recipient Name
            </label>
            <div className="relative">
              <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                id="recipient"
                className="input-field pl-10"
                placeholder="e.g., Electricity Company"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-zinc-300 text-sm font-medium mb-2">
              Amount to Pay
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text" // Use text to control input for decimals
                id="amount"
                className="input-field pl-10"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="button-primary w-full mt-6" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Processing Payment...
              </span>
            ) : (
              'Confirm Payment'
            )}
          </button>
        </form>

        {toastMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-700/80 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-max shadow-lg border border-green-600">
            <CheckCircleIcon className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};