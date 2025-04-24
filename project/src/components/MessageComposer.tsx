import React from 'react';
import { MessageSquare } from 'lucide-react';

interface MessageComposerProps {
  message: string;
  setMessage: (message: string) => void;
  disabled: boolean;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  message,
  setMessage,
  disabled,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-pink-500" />
        Compose Your Message
      </h2>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message Template
        </label>
        <textarea
          id="message"
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          placeholder="Hey {username}, I saw your profile and wanted to connect..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
        ></textarea>
        
        <div className="mt-2 text-xs text-gray-600">
          <p>
            You can use these placeholders:
          </p>
          <ul className="mt-1 list-disc list-inside pl-2">
            <li><code className="bg-gray-100 px-1 py-0.5 rounded">{'{username}'}</code> - Recipient's username</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded">{'{first_name}'}</code> - Recipient's first name (if available)</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded">{'{full_name}'}</code> - Recipient's full name (if available)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;