import React, { useState } from 'react';
import type { Booking } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ConfirmationModal } from './ConfirmationModal';

interface BookingListProps {
  bookings: Booking[];
  onDeleteBooking: (bookingId: string) => void;
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, onDeleteBooking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const openConfirmationModal = (booking: Booking) => {
    setBookingToDelete(booking);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setBookingToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (bookingToDelete) {
      onDeleteBooking(bookingToDelete.id);
      closeConfirmationModal();
    }
  };

  const formatDate = (dateString: string) => {
    // Add timezone offset to ensure the date is displayed correctly as entered
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + (offset*60*1000));
    return adjustedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-4xl mt-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Current Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No rooms are booked yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Guest Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Room Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Check-in Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Check-out Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/50 divide-y divide-slate-800">
                {bookings.sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()).map((booking, index) => (
                  <tr key={booking.id} className={`${index % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-700/30'} hover:bg-slate-700/50 transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{booking.guestName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{booking.roomNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(booking.checkInDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(booking.checkOutDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 text-center">
                      <button 
                        onClick={() => openConfirmationModal(booking)}
                        className="p-2 rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 transition-colors"
                        aria-label={`Delete booking for ${booking.guestName}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {bookingToDelete && (
         <ConfirmationModal
            isOpen={isModalOpen}
            onClose={closeConfirmationModal}
            onConfirm={handleConfirmDelete}
            title="Confirm Deletion"
            message={`Are you sure you want to delete the booking for ${bookingToDelete.guestName} in Room ${bookingToDelete.roomNumber}? This action cannot be undone.`}
        />
      )}
    </>
  );
};