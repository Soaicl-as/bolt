import React, { useRef, useEffect } from 'react';
import { TerminalSquare, Download } from 'lucide-react';

interface ActivityLogProps {
  logs: string[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const downloadLogs = () => {
    const content = logs.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-dm-bot-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <TerminalSquare className="h-5 w-5 mr-2 text-pink-500" />
          Activity Log
        </h2>
        
        {logs.length > 0 && (
          <button
            onClick={downloadLogs}
            className="text-gray-600 hover:text-pink-600 transition-colors p-1"
            title="Download logs"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div
        ref={logContainerRef}
        className="flex-1 bg-gray-900 text-gray-200 rounded-md p-4 font-mono text-xs overflow-y-auto"
        style={{ minHeight: '300px', maxHeight: '600px' }}
      >
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="mb-1 leading-relaxed break-words">
              {log}
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Waiting for activity...
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;