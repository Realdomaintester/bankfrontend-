/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { AccountOverview } from './components/AccountOverview';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Cards } from './components/Cards';
import {
  BanknotesIcon,
  UserCircleIcon,
  CreditCardIcon,
  ArrowRightStartOnRectangleIcon,
  BuildingLibraryIcon,
  RectangleStackIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const Header: React.FC<{ isAuthenticated: boolean; onLogout: () => void }> = ({
  isAuthenticated,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <header className="header-nav fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-4">
        <BuildingLibraryIcon className="w-6 h-6 text-blue-400" />
        <span className="text-lg font-bold text-zinc-100 hidden sm:block">Snips Bank & Trust</span>
      </div>
      <nav className="flex space-x-1 sm:space-x-4">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-2 text-zinc-300 hover:text-white ${
            location.pathname === '/dashboard' ? 'active' : ''
          }`}
        >
          <BanknotesIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <Link
          to="/accounts"
          className={`flex items-center space-x-2 text-zinc-300 hover:text-white ${
            location.pathname === '/accounts' ? 'active' : ''
          }`}
        >
          <CreditCardIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Accounts</span>
        </Link>
        <Link
          to="/cards"
          className={`flex items-center space-x-2 text-zinc-300 hover:text-white ${
            location.pathname === '/cards' ? 'active' : ''
          }`}
        >
          <RectangleStackIcon className="w-5 h-5" />
          <span className="hidden sm:inline">My Cards</span>
        </Link>
        <Link
          to="/profile"
          className={`flex items-center space-x-2 text-zinc-300 hover:text-white ${
            location.pathname === '/profile' ? 'active' : ''
          }`}
        >
          <UserCircleIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Profile</span>
        </Link>
      </nav>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-zinc-400 hover:text-white relative p-1"
          >
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-zinc-900" />
          </button>
          
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-2 w-80 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-20 py-2">
                <div className="px-4 py-2 border-b border-zinc-700">
                  <h3 className="text-sm font-semibold text-zinc-100">Notifications</h3>
                </div>
                <ul className="max-h-64 overflow-y-auto">
                   <li className="px-4 py-3 hover:bg-zinc-700/50 border-b border-zinc-700/50">
                      <p className="text-sm text-zinc-200">Security Alert</p>
                      <p className="text-xs text-zinc-400">New login detected from San Francisco, CA.</p>
                   </li>
                   <li className="px-4 py-3 hover:bg-zinc-700/50 border-b border-zinc-700/50">
                      <p className="text-sm text-zinc-200">Statement Ready</p>
                      <p className="text-xs text-zinc-400">Your July 2024 statement is available for download.</p>
                   </li>
                   <li className="px-4 py-3 hover:bg-zinc-700/50">
                      <p className="text-sm text-zinc-200">Payment Reminder</p>
                      <p className="text-xs text-zinc-400">Snips Credit Card payment due in 3 days.</p>
                   </li>
                </ul>
                <div className="px-4 py-2 border-t border-zinc-700 text-center">
                  <button className="text-xs text-blue-400 hover:text-blue-300">Mark all as read</button>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-400 hover:text-red-300 px-3 py-1 rounded-md transition-colors"
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('isAuthenticated') === 'true',
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    } else if (isAuthenticated && location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
    localStorage.setItem('isAuthenticated', String(success));
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 bg-dot-grid">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main className="pt-20 p-4">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/accounts" element={<AccountOverview />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Dashboard />} />
            </>
          ) : (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          )}
        </Routes>
      </main>
    </div>
  );
};

export default App;
