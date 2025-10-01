import React from 'react';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MailIcon } from './icons/MailIcon';
import { IdIcon } from './icons/IdIcon';
import { CalendarIcon } from './icons/CalendarIcon';

export const BookingDetailsModal = ({ isOpen, onClose, booking, room }) => {
  if (!isOpen || !booking || !room) {
    return null;
  }

  const formatDate = (dateString) => {
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
      onClick={onClose}
    >
      <div className="bg-sky-50 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl leading-6 font-bold text-slate-900" id="modal-title">
                    Booking Details
                </h3>
                <p className="text-sm text-slate-500 mt-1">For {room.name} - Room {room.id}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200" aria-label="Close modal">
              <XIcon className="h-6 w-6 text-slate-500" />
            </button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <img src={room.images[0]} alt={room.name} className="w-full h-40 object-cover rounded-lg"/>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-sky-500 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Check-in</p>
                        <p className="font-bold text-slate-800">{formatDate(booking.checkInDate)}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-sky-500 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Check-out</p>
                        <p className="font-bold text-slate-800">{formatDate(booking.checkOutDate)}</p>
                    </div>
                </div>
                 <div className="border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-500">Total Price</p>
                    <p className="text-2xl font-bold text-slate-900">{booking.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                 </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6">
             <h4 className="font-bold text-slate-700 mb-4">Guest Information</h4>
             <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                    <UserIcon className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-600">{booking.guestName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <PhoneIcon className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-600">{booking.customerPhoneNumber}</span>
                </div>
                 <div className="flex items-center gap-3 text-sm">
                    <MailIcon className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-600">{booking.customerEmail}</span>
                </div>
                 <div className="flex items-center gap-3 text-sm">
                    <IdIcon className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-600">ID: {booking.customerId}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};