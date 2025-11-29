/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// This file defines shared TypeScript interfaces for the frontend and potentially backend.

export interface User {
  id: string;
  username: string;
  profileName: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit_card';
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}