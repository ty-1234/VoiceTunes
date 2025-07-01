// components/StatusIndicator.js
import React from 'react';

const StatusIndicator = ({ isConnected, status }) => {
  return (
    <div className="flex items-center justify-center mb-8" data-testid="status-indicator">
      <div className={`w-3 h-3 rounded-full mr-3 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
      <span className="text-lg font-medium">{status}</span>
    </div>
  );
};

export default StatusIndicator;
