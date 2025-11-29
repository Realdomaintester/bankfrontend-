/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { auth } from '../api';
import {
  ArrowRightOnRectangleIcon,
  FingerPrintIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { BuildingLibraryIcon } from '@heroicons/react/24/solid';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('howard.woods'); // Pre-fill for convenience
  const [password, setPassword] = useState('password123'); // Pre-fill for convenience
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await auth.login(username, password);
      if (user) {
        onLogin(true);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
      onLogin(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
      <div className="card w-full max-w-md p-8 space-y-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <BuildingLibraryIcon className="w-16 h-16 text-blue-500" />
          <h1 className="text-3xl font-bold text-zinc-100">Snips Bank & Trust</h1>
          <p className="text-zinc-400">Secure Digital Banking</p>
        </div>

        <h2 className="text-xl font-semibold text-zinc-200">Welcome Back, Howard Woods</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                id="username"
                className="input-field pl-10"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="password"
                id="password"
                className="input-field pl-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="button-primary w-full" disabled={loading}>
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
                Logging In...
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Sign In</span>
              </span>
            )}
          </button>
        </form>

        <div className="flex flex-col space-y-2 text-sm text-zinc-500">
          <button className="flex items-center justify-center space-x-2 hover:underline">
            <FingerPrintIcon className="w-4 h-4" />
            <span>Enable Two-Factor Authentication</span>
          </button>
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
          <a href="#" className="hover:underline">
            New User? Sign Up
          </a>
        </div>
        <p className="text-xs text-zinc-600">
          Your security is our priority. End-to-end encryption.
        </p>
      </div>
    </div>
  );
};