import React from 'react';
import type { Booking, Room } from '../types';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MailIcon } from './icons/MailIcon';
import { IdIcon } from './icons/IdIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CheckIcon } from './icons/CheckIcon';

interface GuestBookingViewProps {
  booking: Booking;
  room: Room;
  onNewBooking: () => void;
}

export const GuestBookingView: React.FC<GuestBookingViewProps> = ({ booking, room, onNewBooking }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + offset * 60000);
    return adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-sky-50/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl">
        <div className="text-center">
             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
                <CheckIcon className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Your Booking is Confirmed!</h2>
            <p className="text-slate-500 mt-2">Thank you, {booking.guestName}. Please review your reservation details below.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2 mb-3">Reservation Details</h3>
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
                            <p className="text-3xl font-bold text-slate-900">{booking.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2 mb-3">Guest Information</h3>
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
            <div>
                 <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2 mb-3">Room Details</h3>
                 <img src={room.images[0]} alt={room.name} className="w-full h-48 object-cover rounded-lg mb-4"/>
                 <h4 className="font-bold text-xl text-slate-900">{room.name}</h4>
                 <p className="text-sm text-slate-500">Room {room.id}</p>
                 <p className="text-sm text-slate-600 mt-2">{room.description}</p>
            </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <button 
                onClick={onNewBooking}
                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-8 py-3 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
                Make Another Booking
            </button>
        </div>
    </div>
  );
};