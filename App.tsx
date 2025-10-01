import React, { useState } from 'react';
import type { Booking } from './types';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { HotelIcon } from './components/icons/HotelIcon';
import { GuestBookingView } from './components/GuestBookingView';
import { rooms } from './data/rooms';
import { PasswordModal } from './components/PasswordModal';

function App() {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: '1', guestName: 'Alice Johnson', customerPhoneNumber: '1112223333', customerEmail: 'alice@example.com', customerId: 'AB123456', roomNumber: '305', checkInDate: '2024-08-10', checkOutDate: '2024-08-15', totalPrice: 2250 },
    { id: '2', guestName: 'Bob Williams', customerPhoneNumber: '4445556666', customerEmail: 'bob@example.com', customerId: 'CD789012', roomNumber: '412', checkInDate: '2024-08-12', checkOutDate: '2024-08-18', totalPrice: 4500 },
    { id: '3', guestName: 'Charlie Brown', customerPhoneNumber: '7778889999', customerEmail: 'charlie@example.com', customerId: 'EF345678', roomNumber: '305', checkInDate: '2024-09-20', checkOutDate: '2024-09-25', totalPrice: 2250 },
  ]);

  const [userRole, setUserRole] = useState<'guest' | 'admin'>('guest');
  const [guestBookingId, setGuestBookingId] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const addBooking = (newBookingData: Omit<Booking, 'id'>): { error: string | null; bookingId: string | null } => {
    const newBookingStart = new Date(newBookingData.checkInDate);
    const newBookingEnd = new Date(newBookingData.checkOutDate);

    const isOverlap = bookings.some(booking => {
        if (booking.roomNumber !== newBookingData.roomNumber) {
            return false;
        }
        const existingStart = new Date(booking.checkInDate);
        const existingEnd = new Date(booking.checkOutDate);
        
        return newBookingStart < existingEnd && newBookingEnd > existingStart;
    });

    if (isOverlap) {
        return { error: `Error: Room ${newBookingData.roomNumber} is already booked for the selected dates.`, bookingId: null };
    }
    
    const newBookingWithId = { ...newBookingData, id: new Date().toISOString() + Math.random() };
    setBookings(prevBookings => [...prevBookings, newBookingWithId]);
    
    if (userRole === 'guest') {
        setGuestBookingId(newBookingWithId.id);
    }

    return { error: null, bookingId: newBookingWithId.id }; // Indicates success
  };
  
  const deleteBooking = (bookingId: string) => {
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
  };
  
  const handleLogin = (password: string) => {
    // For now, any non-empty password grants access
    if (password) {
      setUserRole('admin');
      setIsPasswordModalOpen(false);
    }
  };

  const guestBooking = guestBookingId ? bookings.find(b => b.id === guestBookingId) : undefined;
  const guestRoom = guestBooking ? rooms.find(r => r.id === guestBooking.roomNumber) : undefined;

  return (
    <div className="min-h-screen text-slate-900 flex flex-col items-center p-4 sm:p-8 font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-sky-100/40 to-sky-200/60 -z-10" />

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        <header className="w-full flex justify-between items-center gap-4 mb-10">
          <div className="flex items-center gap-4 text-left">
            <HotelIcon className="h-12 w-12 text-sky-500" />
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-600">
                Hotel Reservation System
              </h1>
              <p className="text-slate-500 mt-1 hidden sm:block">Sea view hotel Hikkaduwa.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button
                onClick={() => {
                    if (userRole === 'guest') {
                        setIsPasswordModalOpen(true);
                    } else {
                        setUserRole('guest');
                        setGuestBookingId(null); // Reset guest view on mode switch
                    }
                }}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-600 font-semibold hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors text-sm"
              >
                {userRole === 'guest' ? 'Admin Panel' : 'Switch to Guest View'}
              </button>
          </div>
        </header>

        <main className="w-full mx-auto flex flex-col items-center gap-12">
            {userRole === 'admin' && (
              <>
                <div className="w-full">
                    <BookingForm onAddBooking={addBooking} allBookings={bookings} />
                </div>
                <div className="w-full">
                    <BookingList bookings={bookings} onDeleteBooking={deleteBooking} />
                </div>
              </>
            )}
            {userRole === 'guest' && !guestBooking && (
                <div className="w-full">
                    <BookingForm onAddBooking={addBooking} allBookings={bookings} />
                </div>
            )}
             {userRole === 'guest' && guestBooking && guestRoom && (
                <GuestBookingView 
                    booking={guestBooking} 
                    room={guestRoom} 
                    onNewBooking={() => setGuestBookingId(null)} 
                />
            )}
        </main>
        
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>@2025 All rights reserved .</p>
        </footer>
      </div>
      <PasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handleLogin}
      />
    </div>
  );
}

export default App;