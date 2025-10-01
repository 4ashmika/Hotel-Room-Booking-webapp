import React, { useState, useEffect, useRef } from 'react';
import { LockIcon } from './icons/LockIcon';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password cannot be empty.');
      return;
    }
    onConfirm(password);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-sky-50 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-sky-500/20 mb-4">
                <LockIcon className="h-6 w-6 text-sky-500" />
              </div>
              <h3 className="text-lg leading-6 font-bold text-slate-900" id="modal-title">
                Admin Access
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Please enter the password to access the admin panel.
              </p>
            </div>
            <div className="mt-6">
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                ref={inputRef}
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter password..."
                className={`w-full px-4 py-3 bg-sky-100/50 text-slate-900 border rounded-lg focus:ring-2 focus:border-sky-500 transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-sky-500'}`}
                aria-label="Admin Password"
              />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
          </div>
          <div className="bg-sky-100/50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 sm:w-auto sm:text-sm transition-colors"
            >
              Confirm
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-slate-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};