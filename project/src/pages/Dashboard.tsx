import React, { useState } from 'react';
import { LogOut, Send, Users, UserPlus, UserCheck } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import AccountSelector from '../components/AccountSelector';
import MessageComposer from '../components/MessageComposer';
import ControlPanel from '../components/ControlPanel';
import ActivityLog from '../components/ActivityLog';
import DashboardHeader from '../components/DashboardHeader';
import { startDmCampaign } from '../services/instagramApi';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { username, logout } = useInstagram();
  const [targetAccount, setTargetAccount] = useState('');
  const [targetType, setTargetType] = useState<'followers' | 'following'>('followers');
  const [message, setMessage] = useState('');
  const [recipientCount, setRecipientCount] = useState(10);
  const [delay, setDelay] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (log: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const handleStart = async () => {
    if (!targetAccount) {
      toast.error('Please enter a target account');
      return;
    }

    if (!message) {
      toast.error('Please enter a message to send');
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setLogs([]);
    addLog(`Campaign started for ${targetAccount}'s ${targetType}`);

    try {
      const campaign = startDmCampaign({
        targetAccount,
        targetType,
        message,
        recipientCount,
        delay,
      });

      // Setup event listeners for our campaign
      campaign.on('log', (message: string) => {
        addLog(message);
      });

      campaign.on('progress', (current: number, total: number) => {
        const percentage = Math.floor((current / total) * 100);
        setProgress(percentage);
      });

      campaign.on('complete', () => {
        setIsRunning(false);
        addLog('Campaign completed successfully');
        toast.success('DM campaign completed!');
      });

      campaign.on('error', (error: Error) => {
        setIsRunning(false);
        addLog(`Error: ${error.message}`);
        toast.error(error.message);
      });

    } catch (error) {
      setIsRunning(false);
      if (error instanceof Error) {
        addLog(`Failed to start campaign: ${error.message}`);
        toast.error(error.message);
      }
    }
  };

  const handleStop = () => {
    // Logic to stop the campaign would go here
    setIsRunning(false);
    addLog('Campaign stopped by user');
    toast.success('Campaign stopped');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-10">
      <DashboardHeader username={username} onLogout={logout} />
      
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AccountSelector
              targetAccount={targetAccount}
              setTargetAccount={setTargetAccount}
              targetType={targetType}
              setTargetType={setTargetType}
              disabled={isRunning}
            />
            
            <MessageComposer
              message={message}
              setMessage={setMessage}
              disabled={isRunning}
            />
            
            <ControlPanel
              recipientCount={recipientCount}
              setRecipientCount={setRecipientCount}
              delay={delay}
              setDelay={setDelay}
              isRunning={isRunning}
              onStart={handleStart}
              onStop={handleStop}
              progress={progress}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ActivityLog logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;