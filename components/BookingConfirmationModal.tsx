
import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { Booking, Room } from '../types';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Omit<Booking, 'id'> | null;
  rooms: Room[];
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ isOpen, onClose, booking, rooms }) => {
  if (!isOpen || !booking) {
    return null;
  }

  const room = rooms.find(r => r.id === booking.roomNumber);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + offset * 60000);
    return adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md m-4 transform transition-all">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
            Booking Confirmed!
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Thank you, {booking.guestName}. Your reservation is complete.
          </p>

          <div className="mt-6 text-left p-4 bg-gray-100/60 rounded-lg border border-gray-200 space-y-3">
            <p className="text-sm"><span className="font-semibold text-gray-600">Room:</span> <span className="text-gray-800">{room?.name} (Room {booking.roomNumber})</span></p>
            <p className="text-sm"><span className="font-semibold text-gray-600">Check-in:</span> <span className="text-gray-800">{formatDate(booking.checkInDate)}</span></p>
            <p className="text-sm"><span className="font-semibold text-gray-600">Check-out:</span> <span className="text-gray-800">{formatDate(booking.checkOutDate)}</span></p>
            <div className="border-t border-gray-200 my-2"></div>
            <p className="text-lg font-bold"><span className="text-gray-600">Total Price:</span> <span className="text-gray-800">{booking.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl text-center">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex justify-center rounded-md border-b-4 border-blue-800 hover:border-blue-700 active:translate-y-0.5 active:border-b-2 px-8 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
