import React from 'react';
import type { Booking, Room } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { rooms } from '../data/rooms';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Omit<Booking, 'id'> | null;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ isOpen, onClose, booking }) => {
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
      <div className="bg-sky-50 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md m-4 transform transition-all">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
            <CheckIcon className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl leading-6 font-bold text-slate-900" id="modal-title">
            Booking Confirmed!
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Thank you, {booking.guestName}. Your reservation is complete.
          </p>

          <div className="mt-6 text-left p-4 bg-sky-100/50 rounded-lg border border-slate-200 space-y-3">
            <p className="text-sm"><span className="font-semibold text-slate-600">Room:</span> <span className="text-slate-800">{room?.name} (Room {booking.roomNumber})</span></p>
            <p className="text-sm"><span className="font-semibold text-slate-600">Check-in:</span> <span className="text-slate-800">{formatDate(booking.checkInDate)}</span></p>
            <p className="text-sm"><span className="font-semibold text-slate-600">Check-out:</span> <span className="text-slate-800">{formatDate(booking.checkOutDate)}</span></p>
            <div className="border-t border-slate-200 my-2"></div>
            <p className="text-lg font-bold"><span className="text-slate-600">Total Price:</span> <span className="text-slate-800">{booking.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></p>
          </div>
        </div>
        <div className="bg-sky-100/50 px-6 py-4 rounded-b-2xl text-center">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-8 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-colors"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};