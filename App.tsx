import React, { useState } from 'react';
import type { Booking } from './types';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { HotelIcon } from './components/icons/HotelIcon';

function App() {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: '2024-01-01T12:00:00.000Z', guestName: 'Alice Johnson', roomNumber: '305', checkInDate: '2024-08-10', checkOutDate: '2024-08-15', totalPrice: 2250 },
    { id: '2024-01-02T14:30:00.000Z', guestName: 'Bob Williams', roomNumber: '412', checkInDate: '2024-08-12', checkOutDate: '2024-08-18', totalPrice: 4500 },
    { id: '2024-01-03T18:00:00.000Z', guestName: 'Charlie Brown', roomNumber: '305', checkInDate: '2024-08-20', checkOutDate: '2024-08-25', totalPrice: 2250 },
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-8 font-sans">
       <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10" 
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}
      ></div>
      <header className="relative z-10 flex items-center gap-4 mb-10 text-center">
        <HotelIcon className="h-12 w-12 text-blue-400" />
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Hotel Reservation System
          </h1>
          <p className="text-slate-400 mt-1">A Simple MVP for Room Bookings</p>
        </div>
      </header>

      <main className="relative z-10 w-full flex flex-col items-center">
        <BookingForm onAddBooking={addBooking} allBookings={bookings} />
        <BookingList bookings={bookings} onDeleteBooking={deleteBooking} />
      </main>
      
       <footer className="relative z-10 mt-12 text-center text-slate-500 text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;