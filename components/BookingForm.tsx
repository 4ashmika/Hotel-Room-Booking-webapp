import React, { useState, useMemo } from 'react';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MailIcon } from './icons/MailIcon';
import { IdIcon } from './icons/IdIcon';
import { RoomSelector } from './RoomSelector';
import { RoomDetails } from './RoomDetails';
import { Calendar } from './Calendar';
import { rooms } from '../data/rooms';
import { ErrorBanner } from './ErrorBanner';
import { BookingConfirmationModal } from './BookingConfirmationModal';
import { SpinnerIcon } from './icons/SpinnerIcon';

const formatDate = (date) => {
  if (!date) return '';
  // Add time zone offset to prevent date from shifting
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset*60*1000));
  return adjustedDate.toISOString().split('T')[0];
};

export const BookingForm = ({ onAddBooking, allBookings }) => {
  const [guestName, setGuestName] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [error, setError] = useState('');
  // FIX: Explicitly type fieldErrors state to allow dynamic property access for validation styling.
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const unavailableDates = useMemo(() => {
    if (!selectedRoom) return [];

    const dates = new Set();
    allBookings
      .filter(booking => booking.roomNumber === selectedRoom.id)
      .forEach(booking => {
        let currentDate = new Date(booking.checkInDate);
        const endDate = new Date(booking.checkOutDate);
        while (currentDate < endDate) {
          dates.add(formatDate(new Date(currentDate)));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
    return Array.from(dates);
  }, [selectedRoom, allBookings]);

  const { numberOfNights, totalPrice } = useMemo(() => {
    if (selectedRoom && checkInDate && checkOutDate) {
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        return {
          numberOfNights: diffDays,
          totalPrice: diffDays * selectedRoom.pricePerNight,
        };
      }
    }
    return { numberOfNights: 0, totalPrice: 0 };
  }, [selectedRoom, checkInDate, checkOutDate]);

  const handleDateRangeSelect = (range) => {
    setCheckInDate(range.start);
    setCheckOutDate(range.end);
  };
  
  const resetForm = () => {
      setError('');
      setFieldErrors({});
      setGuestName('');
      setCustomerPhoneNumber('');
      setCustomerEmail('');
      setCustomerId('');
      setSelectedRoom(null);
      setCheckInDate(null);
      setCheckOutDate(null);
  }

  const validateForm = () => {
    // FIX: Explicitly type `newFieldErrors` to allow dynamic property assignment and prevent TS errors.
    const newFieldErrors: { [key: string]: boolean } = {};
    if (!guestName.trim()) newFieldErrors.guestName = true;
    if (!customerPhoneNumber.trim()) newFieldErrors.customerPhoneNumber = true;
    if (!customerEmail.trim()) newFieldErrors.customerEmail = true;
    if (!customerId.trim()) newFieldErrors.customerId = true;

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) {
        return false;
    }
    
    if (!/^\d{10}$/.test(customerPhoneNumber)) {
        setError('Please enter a valid 10-digit phone number.');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        setError('Please enter a valid email address.');
        return false;
    }
    if (!selectedRoom || !checkInDate || !checkOutDate || totalPrice <= 0) {
      setError('Please select a room and a valid date range.');
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newBookingData = {
        guestName,
        customerPhoneNumber,
        customerEmail,
        customerId,
        roomNumber: selectedRoom.id,
        checkInDate: formatDate(checkInDate),
        checkOutDate: formatDate(checkOutDate),
        totalPrice,
      };
  
      const result = await onAddBooking(newBookingData);
  
      if (result.error) {
        setError(result.error);
      } else {
        setConfirmedBooking(newBookingData);
        setIsConfirmationModalOpen(true);
        // Do not reset form here for guest view, parent component will handle view switch
        // For admin view, this component stays mounted, so we can reset.
        if (window.location.pathname !== '/guest') { // A simple way to check context
            resetForm();
        }
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationModalOpen(false);
  };

  return (
    <>
      <div className="p-6 sm:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create a New Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                1. Guest Details
                </label>
                <div className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Full Name (e.g., John Doe)"
                    className={`w-full pl-10 pr-4 py-3 bg-white text-gray-800 border rounded-lg focus:ring-2 transition-colors ${fieldErrors.guestName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    aria-label="Guest Name"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="tel" value={customerPhoneNumber} onChange={(e) => setCustomerPhoneNumber(e.target.value)} placeholder="10-digit Phone Number" className={`w-full pl-10 pr-4 py-3 bg-white text-gray-800 border rounded-lg focus:ring-2 transition-colors ${fieldErrors.customerPhoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} aria-label="Phone Number" />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Email Address" className={`w-full pl-10 pr-4 py-3 bg-white text-gray-800 border rounded-lg focus:ring-2 transition-colors ${fieldErrors.customerEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} aria-label="Email Address" />
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IdIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="National ID (NIC)" className={`w-full pl-10 pr-4 py-3 bg-white text-gray-800 border rounded-lg focus:ring-2 transition-colors ${fieldErrors.customerId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} aria-label="National ID"/>
                </div>
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    2. Select a Room
                </label>
                <RoomSelector 
                    rooms={rooms} 
                    selectedRoomId={selectedRoom?.id ?? null} 
                    onSelectRoom={(id) => {
                        setSelectedRoom(rooms.find(r => r.id === id) || null);
                        setCheckInDate(null);
                        setCheckOutDate(null);
                    }}
                />
            </div>

            {selectedRoom && <RoomDetails room={selectedRoom} />}

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    3. Select Check-in and Check-out Dates
                </label>
                <div className={`p-4 rounded-lg bg-white border border-gray-200 transition-opacity ${!selectedRoom ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {selectedRoom ? (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <p className="text-xs text-gray-500">Check-in</p>
                                    <p className="font-bold text-gray-800">{checkInDate ? formatDate(checkInDate) : 'Select date'}</p>
                                </div>
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <p className="text-xs text-gray-500">Check-out</p>
                                    <p className="font-bold text-gray-800">{checkOutDate ? formatDate(checkOutDate) : 'Select date'}</p>
                                </div>
                            </div>
                            <Calendar 
                                unavailableDates={unavailableDates}
                                onRangeSelect={handleDateRangeSelect}
                                initialStartDate={checkInDate}
                                initialEndDate={checkOutDate}
                            />
                        </>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <p>Please select a room to see availability.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {totalPrice > 0 && (
                <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-2">
                    <div className="flex justify-between items-center text-gray-600">
                        <span>{`$${selectedRoom?.pricePerNight} x ${numberOfNights} night(s)`}</span>
                        <span>{totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-900 font-bold text-lg">
                        <span>Total Price</span>
                        <span>{totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    </div>
                </div>
            )}

            {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
            <button
                type="submit"
                className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mt-4 border-b-4 border-blue-800 hover:border-blue-700 active:translate-y-0.5 active:border-b-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-b-4 disabled:hover:border-gray-400"
                disabled={!guestName || !selectedRoom || !checkInDate || !checkOutDate || totalPrice <= 0 || isLoading}
            >
                {isLoading ? (
                    <>
                        <SpinnerIcon className="h-5 w-5 mr-3" />
                        Processing...
                    </>
                ) : (
                    `Book Now for ${totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
                )}
            </button>
            </form>
        </div>
      </div>
      <BookingConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmation}
        booking={confirmedBooking}
      />
    </>
  );
};