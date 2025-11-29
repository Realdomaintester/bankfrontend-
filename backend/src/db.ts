/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// This file simulates a database by providing in-memory mock data.
// In a real application, this would interact with a persistent database (e.g., PostgreSQL, MongoDB).

import { User, Account, Transaction } from './types'; // Using types from local backend types file

export const MOCK_USER: User = {
  id: 'user-123',
  username: 'howard.woods',
  profileName: 'Howard Woods',
};

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc-chk-1', name: 'Checking Account Primary', type: 'checking', balance: 50000.00, currency: 'USD' },
  // Fix: Changed 'type' from number to 'checking' string literal.
  { id: 'acc-chk-2', name: 'Checking Account Secondary', type: 'checking', balance: 12000.50, currency: 'USD' },
  { id: 'acc-sav-1', name: 'Savings Account', type: 'savings', balance: 150000.75, currency: 'USD' },
  { id: 'acc-cc-1', name: 'Snips Credit Card', type: 'credit_card', balance: -2500.00, currency: 'USD' }, // Negative for amount owed
];

export const MOCK_TRANSACTIONS: Transaction[] = [
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

/*
  Conceptual Database Schema (for PostgreSQL/MongoDB as requested)

  --- PostgreSQL Schema ---

  -- Table: users
  CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      profile_name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'customer' NOT NULL, -- 'customer', 'admin'
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Table: accounts
  CREATE TABLE accounts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      account_name VARCHAR(255) NOT NULL,
      account_type VARCHAR(50) NOT NULL, -- 'checking', 'savings', 'credit_card'
      balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
      currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
      account_number VARCHAR(20) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Table: transactions
  CREATE TABLE transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      description TEXT NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      transaction_type VARCHAR(50) NOT NULL, -- 'debit', 'credit', 'transfer', 'bill_pay', 'deposit', 'withdrawal'
      category VARCHAR(100),
      status VARCHAR(50) DEFAULT 'completed' NOT NULL, -- 'pending', 'completed', 'failed'
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Table: two_factor_auth (for 2FA setup)
  CREATE TABLE two_factor_auth (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      secret VARCHAR(255) NOT NULL, -- For TOTP
      is_enabled BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  --- MongoDB Schema (Conceptual Document Structures) ---

  // User Document
  {
    _id: ObjectId("..."),
    username: "howard.woods",
    passwordHash: "...",
    email: "howard.woods@snipsbank.com",
    profileName: "Howard Woods",
    role: "customer",
    isActive: true,
    createdAt: ISODate("..."),
    updatedAt: ISODate("..."),
    twoFactorAuth: {
      isEnabled: false,
      secret: null // Stored if 2FA is set up
    }
  }

  // Account Document
  {
    _id: ObjectId("..."),
    userId: ObjectId("..."), // Reference to User
    accountName: "Checking Account Primary",
    accountType: "checking",
    balance: 50000.00,
    currency: "USD",
    accountNumber: "...", // Unique identifier
    createdAt: ISODate("..."),
    updatedAt: ISODate("...")
  }

  // Transaction Document
  {
    _id: ObjectId("..."),
    accountId: ObjectId("..."), // Reference to Account
    transactionDate: ISODate("..."),
    description: "Grocery Store",
    amount: -75.50,
    transactionType: "debit",
    category: "Groceries",
    status: "completed",
    createdAt: ISODate("...")
  }

  // Indices would be added for performance on frequently queried fields
*/