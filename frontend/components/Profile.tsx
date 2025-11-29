/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { UserCircleIcon, ShieldCheckIcon, DevicePhoneMobileIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { BANK_INFO } from '../api';

export const Profile: React.FC = () => {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-zinc-100 mb-8">User Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="card md:col-span-1 flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center border-4 border-zinc-700">
             <UserCircleIcon className="w-20 h-20 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{BANK_INFO.profileName}</h2>
            <p className="text-blue-400 font-medium">Premium Member</p>
            <p className="text-zinc-500 text-sm mt-1">Member since 2018</p>
          </div>
          <button className="button-primary w-full">Edit Avatar</button>
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Personal Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-zinc-200 mb-4 border-b border-zinc-700 pb-2">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <EnvelopeIcon className="w-5 h-5 text-zinc-500 mt-1" />
                <div>
                  <p className="text-sm text-zinc-400">Email Address</p>
                  <p className="text-zinc-200">howard.woods@snipsbank.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <DevicePhoneMobileIcon className="w-5 h-5 text-zinc-500 mt-1" />
                <div>
                  <p className="text-sm text-zinc-400">Phone Number</p>
                  <p className="text-zinc-200">+1 (555) 019-2834</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                 <MapPinIcon className="w-5 h-5 text-zinc-500 mt-1" />
                 <div>
                   <p className="text-sm text-zinc-400">Mailing Address</p>
                   <p className="text-zinc-200">123 Financial District Blvd, Suite 400<br/>New York, NY 10005</p>
                 </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
               <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Update Information</button>
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <h3 className="text-lg font-semibold text-zinc-200 mb-4 border-b border-zinc-700 pb-2 flex items-center gap-2">
               <ShieldCheckIcon className="w-5 h-5 text-green-500" />
               Security Settings
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <div>
                    <p className="text-zinc-200">Two-Factor Authentication</p>
                    <p className="text-xs text-zinc-500">Adds an extra layer of security to your account.</p>
                  </div>
                  <div className="h-6 w-11 bg-green-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                  </div>
               </div>
               <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                  <div>
                    <p className="text-zinc-200">Change Password</p>
                    <p className="text-xs text-zinc-500">Last changed 3 months ago.</p>
                  </div>
                  <button className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm text-white">Change</button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};