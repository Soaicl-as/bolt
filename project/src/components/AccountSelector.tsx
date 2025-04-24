import React from 'react';
import { Search, Users, UserPlus } from 'lucide-react';

interface AccountSelectorProps {
  targetAccount: string;
  setTargetAccount: (account: string) => void;
  targetType: 'followers' | 'following';
  setTargetType: (type: 'followers' | 'following') => void;
  disabled: boolean;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  targetAccount,
  setTargetAccount,
  targetType,
  setTargetType,
  disabled,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Search className="h-5 w-5 mr-2 text-pink-500" />
        Target Account Selection
      </h2>
      
      <div className="mb-4">
        <label htmlFor="targetAccount" className="block text-sm font-medium text-gray-700 mb-1">
          Instagram Username
        </label>
        <input
          type="text"
          id="targetAccount"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="e.g., instagram"
          value={targetAccount}
          onChange={(e) => setTargetAccount(e.target.value)}
          disabled={disabled}
        />
      </div>
      
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">Extract from:</p>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setTargetType('followers')}
            className={`flex items-center px-4 py-2 rounded-md ${
              targetType === 'followers'
                ? 'bg-pink-100 text-pink-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            <Users className="h-4 w-4 mr-2" />
            Followers
          </button>
          
          <button
            type="button"
            onClick={() => setTargetType('following')}
            className={`flex items-center px-4 py-2 rounded-md ${
              targetType === 'following'
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Following
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSelector;