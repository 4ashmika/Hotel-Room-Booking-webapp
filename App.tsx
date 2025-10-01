import React, { useState } from 'react';
import type { Booking } from './types';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { HotelIcon } from './components/icons/HotelIcon';

function App() {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: '1', guestName: 'Alice Johnson', customerPhoneNumber: '1112223333', customerEmail: 'alice@example.com', customerId: 'AB123456', roomNumber: '305', checkInDate: '2024-08-10', checkOutDate: '2024-08-15', totalPrice: 2250 },
    { id: '2', guestName: 'Bob Williams', customerPhoneNumber: '4445556666', customerEmail: 'bob@example.com', customerId: 'CD789012', roomNumber: '412', checkInDate: '2024-08-12', checkOutDate: '2024-08-18', totalPrice: 4500 },
    { id: '3', guestName: 'Charlie Brown', customerPhoneNumber: '7778889999', customerEmail: 'charlie@example.com', customerId: 'EF345678', roomNumber: '305', checkInDate: '2024-09-20', checkOutDate: '2024-09-25', totalPrice: 2250 },
  ]);

  const addBooking = (newBooking: Omit<Booking, 'id'>): string | null => {
    const newBookingStart = new Date(newBooking.checkInDate);
    const newBookingEnd = new Date(newBooking.checkOutDate);

    const isOverlap = bookings.some(booking => {
        if (booking.roomNumber !== newBooking.roomNumber) {
            return false;
        }
        const existingStart = new Date(booking.checkInDate);
        const existingEnd = new Date(booking.checkOutDate);
        
        return newBookingStart < existingEnd && newBookingEnd > existingStart;
    });

    if (isOverlap) {
        return `Error: Room ${newBooking.roomNumber} is already booked for the selected dates.`;
    }

    setBookings(prevBookings => [...prevBookings, { ...newBooking, id: new Date().toISOString() + Math.random() }]);
    return null; // Indicates success
  };
  
  const deleteBooking = (bookingId: string) => {
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4 sm:p-8 font-sans">
       <div 
        className="fixed top-0 left-0 w-full h-full bg-cover bg-fixed bg-center opacity-10 -z-10" 
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}
      ></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <header className="flex items-center gap-4 mb-10 text-center">
          <HotelIcon className="h-12 w-12 text-blue-400" />
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              Hotel Reservation System
            </h1>
            <p className="text-slate-400 mt-1">By Rashmika Geethanjana</p>
          </div>
        </header>

        <main className="w-full max-w-7xl mx-auto flex flex-col items-center gap-12">
          <div className="w-full">
            <BookingForm onAddBooking={addBooking} allBookings={bookings} />
          </div>
          <div className="w-full">
            <BookingList bookings={bookings} onDeleteBooking={deleteBooking} />
          </div>
        </main>
        
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>Built with React, TypeScript, and Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;