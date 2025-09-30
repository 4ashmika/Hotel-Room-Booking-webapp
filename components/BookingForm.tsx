import React, { useState, useMemo } from 'react';
import type { Booking, Room } from '../types';
import { UserIcon } from './icons/UserIcon';
import { RoomSelector } from './RoomSelector';
import { Calendar } from './Calendar';
import { rooms } from '../data/rooms';
import { ErrorBanner } from './ErrorBanner';

interface BookingFormProps {
  onAddBooking: (booking: Omit<Booking, 'id'>) => string | null;
  allBookings: Booking[];
}

const formatDate = (date: Date | null) => {
  if (!date) return '';
  // Add time zone offset to prevent date from shifting
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset*60*1000));
  return adjustedDate.toISOString().split('T')[0];
};

export const BookingForm: React.FC<BookingFormProps> = ({ onAddBooking, allBookings }) => {
  const [guestName, setGuestName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const unavailableDates = useMemo(() => {
    if (!selectedRoom) return [];

    const dates = new Set<string>();
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

  const handleDateRangeSelect = (range: { start: Date | null, end: Date | null }) => {
    setCheckInDate(range.start);
    setCheckOutDate(range.end);
  };
  
  const resetForm = () => {
      setError('');
      setGuestName('');
      setSelectedRoom(null);
      setCheckInDate(null);
      setCheckOutDate(null);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (!guestName.trim() || !selectedRoom || !checkInDate || !checkOutDate || totalPrice <= 0) {
      setError('Please fill all fields, select a room, and a valid date range.');
      return;
    }

    const bookingError = onAddBooking({
      guestName,
      roomNumber: selectedRoom.id,
      checkInDate: formatDate(checkInDate),
      checkOutDate: formatDate(checkOutDate),
      totalPrice,
    });

    if (bookingError) {
      setError(bookingError);
    } else {
      resetForm();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Book a Room</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-slate-300 mb-2">
            1. Guest Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g., John Doe"
              className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-label="Guest Name"
            />
          </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
                2. Select a Room
            </label>
            <RoomSelector 
                rooms={rooms} 
                selectedRoomId={selectedRoom?.id ?? null} 
                onSelectRoom={(id) => {
                    setSelectedRoom(rooms.find(r => r.id === id) || null);
                    // Reset dates when room changes
                    setCheckInDate(null);
                    setCheckOutDate(null);
                }}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
                3. Select Check-in and Check-out Dates
            </label>
            <div className={`p-4 rounded-lg bg-slate-900/50 border border-slate-700 transition-opacity ${!selectedRoom ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {selectedRoom ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                            <div className="p-3 bg-slate-700 rounded-lg">
                                <p className="text-xs text-slate-400">Check-in</p>
                                <p className="font-bold text-white">{checkInDate ? formatDate(checkInDate) : 'Select date'}</p>
                            </div>
                            <div className="p-3 bg-slate-700 rounded-lg">
                                <p className="text-xs text-slate-400">Check-out</p>
                                <p className="font-bold text-white">{checkOutDate ? formatDate(checkOutDate) : 'Select date'}</p>
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
                    <div className="text-center py-16 text-slate-400">
                        <p>Please select a room to see availability.</p>
                    </div>
                )}
            </div>
        </div>
        
        {totalPrice > 0 && (
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50 space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                    <span>{`$${selectedRoom?.pricePerNight} x ${numberOfNights} night(s)`}</span>
                    <span>{totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <div className="flex justify-between items-center text-white font-bold text-lg">
                    <span>Total Price</span>
                    <span>{totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            </div>
        )}

        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-transform transform hover:scale-105 mt-4 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:scale-100"
          disabled={!guestName || !selectedRoom || !checkInDate || !checkOutDate || totalPrice <= 0}
        >
          Book Now for {totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </button>
      </form>
    </div>
  );
};