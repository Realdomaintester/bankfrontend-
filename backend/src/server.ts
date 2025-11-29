/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import express from 'express';
import cors from 'cors';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_USER } from './db'; // Use mock data from db.ts
import { Account, Transaction } from './types'; // Using types from local backend types file

const app = express();
const PORT = 3001;

// Use cors middleware globally.
app.use(cors() as any);
app.use(express.json() as any);

// --- User Authentication ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'howard.woods' && password === 'password123') {
    return res.status(200).json(MOCK_USER);
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// --- Account Management ---
app.get('/api/accounts', (req, res) => {
  return res.status(200).json(MOCK_ACCOUNTS);
});

app.get('/api/accounts/:id', (req, res) => {
  const { id } = req.params;
  const account = MOCK_ACCOUNTS.find(acc => acc.id === id);
  if (account) {
    return res.status(200).json(account);
  }
  return res.status(404).json({ message: 'Account not found' });
});

// Deposit Endpoint
app.post('/api/accounts/:id/deposit', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const account = MOCK_ACCOUNTS.find(acc => acc.id === id);

  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount. Must be positive.' });
  }

  account.balance += amount; // Directly modify mock data
  const newTransaction: Transaction = {
    id: `trn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    accountId: id,
    date: new Date().toISOString().split('T')[0],
    description: `Deposit`,
    amount: amount,
    type: 'credit',
  };
  MOCK_TRANSACTIONS.unshift(newTransaction); // Add to mock transactions
  return res.status(200).json({ message: 'Deposit successful', newBalance: account.balance, transaction: newTransaction });
});

// Withdraw Endpoint
app.post('/api/accounts/:id/withdraw', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const account = MOCK_ACCOUNTS.find(acc => acc.id === id);

  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount. Must be positive.' });
  }

  if (account.balance < amount) {
    return res.status(400).json({ message: 'Insufficient funds.' });
  }

  account.balance -= amount; // Deduct
  const newTransaction: Transaction = {
    id: `trn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    accountId: id,
    date: new Date().toISOString().split('T')[0],
    description: `Withdrawal`,
    amount: -amount, // Debit
    type: 'debit',
  };
  MOCK_TRANSACTIONS.unshift(newTransaction);

  return res.status(200).json({ message: 'Withdrawal successful', newBalance: account.balance, transaction: newTransaction });
});

// New endpoint for bill payment
app.post('/api/accounts/:id/pay-bill', (req, res) => {
  const { id } = req.params;
  const { recipient, amount } = req.body;
  const account = MOCK_ACCOUNTS.find(acc => acc.id === id);

  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount. Amount must be a positive number.' });
  }

  if (account.balance < amount) {
    return res.status(400).json({ message: 'Insufficient funds.' });
  }

  // Deduct amount from account balance
  account.balance -= amount;

  // Create a new transaction
  const newTransaction: Transaction = {
    id: `trn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    accountId: id,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    description: `Bill Payment to ${recipient}`,
    amount: -amount, // Debit transaction, so negative
    type: 'debit',
  };
  MOCK_TRANSACTIONS.unshift(newTransaction); // Add to mock transactions

  return res.status(200).json({
    message: 'Bill payment successful',
    newBalance: account.balance,
    transaction: newTransaction,
  });
});

// Transfer Endpoint (Internal)
app.post('/api/transfer', (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  if (!fromAccountId || !toAccountId || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (fromAccountId === toAccountId) {
    return res.status(400).json({ message: 'Cannot transfer to the same account' });
  }

  const fromAccount = MOCK_ACCOUNTS.find(acc => acc.id === fromAccountId);
  const toAccount = MOCK_ACCOUNTS.find(acc => acc.id === toAccountId);

  if (!fromAccount || !toAccount) {
    return res.status(404).json({ message: 'One or both accounts not found' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Amount must be positive' });
  }

  if (fromAccount.balance < amount) {
    return res.status(400).json({ message: 'Insufficient funds in source account' });
  }

  // Perform transfer
  fromAccount.balance -= amount;
  toAccount.balance += amount;

  const date = new Date().toISOString().split('T')[0];

  // Debit Transaction for Sender
  const debitTx: Transaction = {
    id: `trn-${Date.now()}-d`,
    accountId: fromAccountId,
    date,
    description: `Transfer to ${toAccount.name}`,
    amount: -amount,
    type: 'debit',
  };

  // Credit Transaction for Receiver
  const creditTx: Transaction = {
    id: `trn-${Date.now()}-c`,
    accountId: toAccountId,
    date,
    description: `Transfer from ${fromAccount.name}`,
    amount: amount,
    type: 'credit',
  };

  MOCK_TRANSACTIONS.unshift(debitTx, creditTx);

  return res.status(200).json({ message: 'Transfer successful', transactions: [debitTx, creditTx] });
});

// --- Transaction History ---
app.get('/api/transactions', (req, res) => {
  const { accountId, type, startDate, endDate } = req.query;
  let filteredTransactions = [...MOCK_TRANSACTIONS];

  if (accountId) {
    filteredTransactions = filteredTransactions.filter(t => t.accountId === accountId);
  }
  if (type) {
    filteredTransactions = filteredTransactions.filter(t => t.type === type);
  }
  if (startDate) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= new Date(startDate as string));
  }
  if (endDate) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= new Date(endDate as string));
  }

  return res.status(200).json(filteredTransactions);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});