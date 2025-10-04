
import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { SearchIcon } from './icons/SearchIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ErrorBanner } from './ErrorBanner';

export const FindBookingView = ({ onFindBooking }) => {
    const [guestName, setGuestName] = useState('');
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!guestName.trim() || !customerPhoneNumber.trim()) {
            setError('Please provide both guest name and phone number.');
            return;
        }

        setIsLoading(true);
        const result = await onFindBooking({ guestName, customerPhoneNumber });
        setIsLoading(false);

        if (result.error) {
            setError(result.error);
        }
    };

    return (
        <div className="p-6 sm:p-8 lg:p-12">
            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Find Your Booking</h2>
                <p className="text-gray-500 text-center mb-8">Enter your details to retrieve your reservation.</p>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Full Name used for booking"
                            className="w-full pl-10 pr-4 py-2 bg-transparent text-gray-900 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-500 transition-colors"
                            aria-label="Guest Name"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            value={customerPhoneNumber}
                            onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                            placeholder="10-digit Phone Number"
                            className="w-full pl-10 pr-4 py-2 bg-transparent text-gray-900 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-500 transition-colors"
                            aria-label="Phone Number"
                        />
                    </div>

                    {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
                    
                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all mt-4 border-b-4 border-blue-800 hover:border-blue-700 active:translate-y-0.5 active:border-b-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <SpinnerIcon className="h-5 w-5 mr-3" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <SearchIcon className="h-5 w-5 mr-2" />
                                Find Booking
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
