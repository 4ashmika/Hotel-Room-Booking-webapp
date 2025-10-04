import React, { useState, useEffect, useRef } from 'react';
import { LockIcon } from './icons/LockIcon';

export const PasswordModal = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

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

  const handleSubmit = (e) => {
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
        className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <LockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                Admin Access
              </h3>
              <p className="mt-2 text-sm text-gray-500">
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
                className={`w-full px-4 py-3 bg-white text-gray-800 border rounded-lg focus:ring-2 focus:border-blue-500 transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                aria-label="Admin Password"
              />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border-b-4 border-blue-800 hover:border-blue-700 active:translate-y-0.5 active:border-b-2 px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-all"
            >
              Confirm
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
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