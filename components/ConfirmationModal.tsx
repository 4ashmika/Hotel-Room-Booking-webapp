import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md m-4 transform transition-all">
        <div className="p-8">
          <div className="text-center">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
              <AlertTriangleIcon className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg leading-6 font-bold text-white" id="modal-title">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-slate-400">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 sm:w-auto sm:text-sm transition-colors"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-slate-600 shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
