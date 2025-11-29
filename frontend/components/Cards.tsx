/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { CreditCardIcon, LockClosedIcon, LockOpenIcon, EyeIcon, SignalIcon } from '@heroicons/react/24/outline';

export const Cards: React.FC = () => {
  const [isFrozen, setIsFrozen] = useState(false);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-zinc-100 mb-8">My Cards</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card Visual */}
        <div className="flex flex-col items-center space-y-6">
           {/* CSS-only Credit Card */}
           <div className={`w-full max-w-md aspect-[1.586/1] rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${isFrozen ? 'grayscale opacity-80' : 'bg-gradient-to-br from-blue-600 to-purple-700'}`}>
              
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              
              <div className="relative z-10 flex flex-col justify-between h-full text-white">
                 <div className="flex justify-between items-start">
                    <SignalIcon className="w-8 h-8 rotate-90" />
                    <span className="font-bold text-xl italic tracking-wider">SNIPS BANK</span>
                 </div>
                 
                 <div className="flex items-center gap-4 my-4">
                    <div className="w-12 h-9 bg-yellow-400 rounded-md opacity-90 flex items-center justify-center">
                       <div className="w-8 h-6 border border-yellow-600/50 rounded-sm"></div>
                    </div>
                    <SignalIcon className="w-6 h-6" />
                 </div>

                 <div>
                    <p className="font-mono text-xl sm:text-2xl tracking-widest drop-shadow-md">
                       4532  8900  1234  5678
                    </p>
                    <div className="flex justify-between items-end mt-4">
                       <div>
                          <p className="text-xs opacity-75 uppercase">Card Holder</p>
                          <p className="font-medium tracking-wide uppercase">Howard Woods</p>
                       </div>
                       <div>
                          <p className="text-xs opacity-75 uppercase">Expires</p>
                          <p className="font-medium tracking-wide">12/28</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {isFrozen && (
             <div className="flex items-center gap-2 text-red-400 bg-red-900/20 px-4 py-2 rounded-full border border-red-800">
                <LockClosedIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">Card is currently frozen</span>
             </div>
           )}
        </div>

        {/* Card Controls */}
        <div className="card h-fit">
           <h2 className="text-xl font-semibold text-zinc-100 mb-6">Card Controls</h2>
           
           <div className="space-y-2">
              <button 
                onClick={() => setIsFrozen(!isFrozen)}
                className="w-full p-4 flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors group"
              >
                 <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isFrozen ? 'bg-red-500/20 text-red-400' : 'bg-zinc-700 text-zinc-400'} group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors`}>
                       {isFrozen ? <LockOpenIcon className="w-6 h-6" /> : <LockClosedIcon className="w-6 h-6" />}
                    </div>
                    <div className="text-left">
                       <p className="font-medium text-zinc-200">{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</p>
                       <p className="text-xs text-zinc-500">Temporarily disable all transactions</p>
                    </div>
                 </div>
              </button>

              <button className="w-full p-4 flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-zinc-700 text-zinc-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                       <EyeIcon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                       <p className="font-medium text-zinc-200">View PIN</p>
                       <p className="text-xs text-zinc-500">Reveal your 4-digit security pin</p>
                    </div>
                 </div>
              </button>

              <button className="w-full p-4 flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-zinc-700 text-zinc-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                       <CreditCardIcon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                       <p className="font-medium text-zinc-200">Replace Card</p>
                       <p className="text-xs text-zinc-500">Request a new card if lost or stolen</p>
                    </div>
                 </div>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};