import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { XIcon } from './icons/XIcon';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  return (
    <div
      className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative my-4 flex items-start gap-3 transition-opacity"
      role="alert"
    >
      <div className="flex-shrink-0 pt-0.5">
         <AlertTriangleIcon className="h-5 w-5 text-red-400" />
      </div>
      
      <div className="flex-grow">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline ml-2">{message}</span>
      </div>

      <button
        onClick={onDismiss}
        className="p-1 -mr-1 -mt-1 rounded-full hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400"
        aria-label="Dismiss"
      >
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
