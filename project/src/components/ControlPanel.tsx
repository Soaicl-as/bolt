import React from 'react';
import { Settings, Play, Pause } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ControlPanelProps {
  recipientCount: number;
  setRecipientCount: (count: number) => void;
  delay: number;
  setDelay: (delay: number) => void;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  progress: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  recipientCount,
  setRecipientCount,
  delay,
  setDelay,
  isRunning,
  onStart,
  onStop,
  progress,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-pink-500" />
        Campaign Settings & Controls
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="recipientCount" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Recipients
          </label>
          <input
            type="number"
            id="recipientCount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="10"
            min="1"
            max="100"
            value={recipientCount}
            onChange={(e) => setRecipientCount(parseInt(e.target.value) || 10)}
            disabled={isRunning}
          />
        </div>
        
        <div>
          <label htmlFor="delay" className="block text-sm font-medium text-gray-700 mb-1">
            Delay Between Messages (seconds)
          </label>
          <input
            type="number"
            id="delay"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="60"
            min="30"
            max="600"
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value) || 60)}
            disabled={isRunning}
          />
        </div>
      </div>
      
      {isRunning && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 flex items-center"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Campaign
          </button>
        ) : (
          <button
            onClick={onStop}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-md hover:from-red-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 flex items-center"
          >
            <Pause className="h-4 w-4 mr-2" />
            Stop Campaign
          </button>
        )}
      </div>
      
      <div className="mt-4 text-xs text-center text-gray-500">
        ⚠️ Use responsibly. Sending too many messages too quickly may result in temporary restrictions.
      </div>
    </div>
  );
};

export default ControlPanel;