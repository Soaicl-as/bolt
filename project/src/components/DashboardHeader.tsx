import React from 'react';
import { Instagram, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  username: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ username, onLogout }) => {
  return (
    <header className="bg-white shadow-md px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Instagram className="text-pink-600 h-6 w-6" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            Instagram DM Bot
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Logged in as <span className="font-semibold text-gray-800">{username}</span>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 text-gray-600 hover:text-pink-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;