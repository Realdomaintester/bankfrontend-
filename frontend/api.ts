/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// This file simulates API interactions. In a real application, these would make
// actual HTTP requests to your backend server.

import { User, Account, Transaction } from './types'; // Import from centralized types file

const MOCK_USER: User = {
  id: 'user-123',
  username: 'howard.woods',
  profileName: 'Howard Woods',
};

const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc-chk-1', name: 'Checking Account Primary', type: 'checking', balance: 50000.00, currency: 'USD' },
  { id: 'acc-chk-2', name: 'Checking Account Secondary', type: 'checking', balance: 12000.50, currency: 'USD' },
  { id: 'acc-sav-1', name: 'Savings Account', type: 'savings', balance: 150000.75, currency: 'USD' },
  { id: 'acc-cc-1', name: 'Snips Credit Card', type: 'credit_card', balance: -2500.00, currency: 'USD' }, // Negative for amount owed
];

const MOCK_TRANSACTIONS: Transaction[] = [
  // Sample transactions for the last 6 months
  { id: 'trn-1', accountId: 'acc-chk-1', date: '2024-07-20', description: 'Grocery Store', amount: -75.50, type: 'debit' },
  { id: 'trn-2', accountId: 'acc-chk-1', date: '2024-07-19', description: 'Paycheck Deposit', amount: 2500.00, type: 'credit' },
  { id: 'trn-3', accountId: 'acc-sav-1', date: '2024-07-18', description: 'Interest Earned', amount: 15.20, type: 'credit' },
  { id: 'trn-4', accountId: 'acc-cc-1', date: '2024-07-17', description: 'Online Shopping', amount: -120.00, type: 'debit' },
  { id: 'trn-5', accountId: 'acc-chk-2', date: '2024-07-16', description: 'Utilities Bill', amount: -150.00, type: 'debit' },
  { id: 'trn-6', accountId: 'acc-chk-1', date: '2024-06-25', description: 'Restaurant', amount: -55.00, type: 'debit' },
  { id: 'trn-7', accountId: 'acc-chk-1', date: '2024-06-20', description: 'Paycheck Deposit', amount: 2500.00, type: 'credit' },
  { id: 'trn-8', accountId: 'acc-sav-1', date: '2024-06-15', description: 'Transfer to Checking', amount: -500.00, type: 'debit' },
  { id: 'trn-9', accountId: 'acc-cc-1', date: '2024-05-10', description: 'Gas Station', amount: -60.00, type: 'debit' },
  { id: 'trn-10', accountId: 'acc-chk-2', date: '2024-04-01', description: 'Subscription Service', amount: -10.99, type: 'debit' },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const auth = {
  login: async (username: string, password: string): Promise<User | null> => {
    await sleep(500); // Simulate network delay
    if (username === 'howard.woods' && password === 'password123') {
      return MOCK_USER;
    }
    throw new Error('Invalid credentials');
  },
  // Placeholder for signup, password reset, 2FA
};

export const accounts = {
  getAccounts: async (): Promise<Account[]> => {
    await sleep(300);
    // In a real app, this would fetch from /api/accounts
    return MOCK_ACCOUNTS;
  },
  getAccountById: async (id: string): Promise<Account | undefined> => {
    await sleep(300);
    // In a real app, this would fetch from /api/accounts/:id
    return MOCK_ACCOUNTS.find(acc => acc.id === id);
  },
  deposit: async (accountId: string, amount: number): Promise<Transaction> => {
    await sleep(600);
    const account = MOCK_ACCOUNTS.find(acc => acc.id === accountId);
    if (!account) throw new Error('Account not found');
    if (amount <= 0) throw new Error('Amount must be positive');

    account.balance += amount;
    const newTransaction: Transaction = {
      id: `trn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      accountId: accountId,
      date: new Date().toISOString().split('T')[0],
      description: 'Deposit',
      amount: amount,
      type: 'credit',
    };
    MOCK_TRANSACTIONS.unshift(newTransaction);
    return newTransaction;
  },
  withdraw: async (accountId: string, amount: number): Promise<Transaction> => {
    await sleep(600);
    const account = MOCK_ACCOUNTS.find(acc => acc.id === accountId);
    if (!account) throw new Error('Account not found');
    if (amount <= 0) throw new Error('Amount must be positive');
    if (account.balance < amount) throw new Error('Insufficient funds');

    account.balance -= amount;
    const newTransaction: Transaction = {
      id: `trn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      accountId: accountId,
      date: new Date().toISOString().split('T')[0],
      description: 'Withdrawal',
      amount: -amount,
      type: 'debit',
    };
    MOCK_TRANSACTIONS.unshift(newTransaction);
    return newTransaction;
  },
  payBill: async (accountId: string, recipient: string, amount: number): Promise<Transaction> => {
    await sleep(700); // Simulate network delay for payment
    // Simulate backend logic for payment
    const account = MOCK_ACCOUNTS.find(acc => acc.id === accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    if (account.balance < amount) {
      throw new Error('Insufficient funds');
    }
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    account.balance -= amount; // Deduct from mock balance
    const newTransaction: Transaction = {
      id: `trn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      accountId: accountId,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      description: `Bill Payment to ${recipient}`,
      amount: -amount, // Debit transaction
      type: 'debit',
    };
    MOCK_TRANSACTIONS.unshift(newTransaction); // Add to mock transactions

    // In a real app, this would be an actual POST request to /api/accounts/:id/pay-bill
    return newTransaction;
  },
  transfer: async (fromAccountId: string, toAccountId: string, amount: number): Promise<void> => {
    await sleep(800);
    const fromAccount = MOCK_ACCOUNTS.find(acc => acc.id === fromAccountId);
    const toAccount = MOCK_ACCOUNTS.find(acc => acc.id === toAccountId);
    
    if (!fromAccount || !toAccount) throw new Error('One or both accounts not found');
    if (fromAccount.balance < amount) throw new Error('Insufficient funds');
    
    fromAccount.balance -= amount;
    toAccount.balance += amount;
    
    const date = new Date().toISOString().split('T')[0];
    MOCK_TRANSACTIONS.unshift({
      id: `trn-d-${Date.now()}`,
      accountId: fromAccountId,
      date,
      description: `Transfer to ${toAccount.name}`,
      amount: -amount,
      type: 'debit'
    });
    MOCK_TRANSACTIONS.unshift({
      id: `trn-c-${Date.now()}`,
      accountId: toAccountId,
      date,
      description: `Transfer from ${fromAccount.name}`,
      amount: amount,
      type: 'credit'
    });
  }
};

export const transactions = {
  getTransactions: async (accountId?: string): Promise<Transaction[]> => {
    await sleep(400);
    if (accountId) {
      return MOCK_TRANSACTIONS.filter(t => t.accountId === accountId);
    }
    return MOCK_TRANSACTIONS;
  },
  // Placeholder for filtering by date/type
};

// In a real app, you'd fetch these values from the backend
export const BANK_INFO = {
  bankName: 'Snips Bank & Trust',
  totalBalance: 950_000_000_000,
  recentTransactionsSummary: 143_000_000, // total for 6 months
  profileName: 'Howard Woods',
};