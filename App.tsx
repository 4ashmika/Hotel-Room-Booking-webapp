import React, { useState, useEffect } from 'react';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { GuestBookingView } from './components/GuestBookingView';
import { rooms } from './data/rooms';
import { PasswordModal } from './components/PasswordModal';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RoomsView } from './components/RoomsView';
import { MenuIcon } from './components/icons/MenuIcon';
import { HotelIcon } from './components/icons/HotelIcon';
import { XIcon } from './components/icons/XIcon';
import { LockIcon } from './components/icons/LockIcon';
import { LogoutIcon } from './components/icons/LogoutIcon';

type View = 'dashboard' | 'bookings' | 'new_booking' | 'rooms';

function App() {
  const [bookings, setBookings] = useState([
    { id: '1', guestName: 'Alice Johnson', customerPhoneNumber: '1112223333', customerEmail: 'alice@example.com', customerId: 'AB123456', roomNumber: '305', checkInDate: '2024-08-10', checkOutDate: '2024-08-15', totalPrice: 2250 },
    { id: '2', guestName: 'Bob Williams', customerPhoneNumber: '4445556666', customerEmail: 'bob@example.com', customerId: 'CD789012', roomNumber: '412', checkInDate: '2024-08-12', checkOutDate: '2024-08-18', totalPrice: 4500 },
    { id: '3', guestName: 'Charlie Brown', customerPhoneNumber: '7778889999', customerEmail: 'charlie@example.com', customerId: 'EF345678', roomNumber: '305', checkInDate: '2024-09-20', checkOutDate: '2024-09-25', totalPrice: 2250 },
  ]);

  const [userRole, setUserRole] = useState('guest');
  const [guestBookingId, setGuestBookingId] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (userRole === 'guest') {
        setActiveView('new_booking');
        setIsSidebarOpen(false);
    } else {
        setActiveView('dashboard');
    }
  }, [userRole]);

  const addBooking = (newBookingData) => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
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
          resolve({ error: `Error: Room ${newBookingData.roomNumber} is already booked for the selected dates.`, bookingId: null });
          return;
        }
        
        const newBookingWithId = { ...newBookingData, id: new Date().toISOString() + Math.random() };
        setBookings(prevBookings => [...prevBookings, newBookingWithId]);
        
        if (userRole === 'guest') {
            setGuestBookingId(newBookingWithId.id);
        }

        resolve({ error: null, bookingId: newBookingWithId.id }); // Indicates success
      }, 1500);
    });
  };
  
  const deleteBooking = (bookingId) => {
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
  };
  
  const updateBookingDetails = (bookingId, updatedDetails) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === bookingId ? { ...booking, ...updatedDetails } : booking
                )
            );
            resolve({ success: true });
        }, 1000);
    });
  };

  const handleLogin = (password) => {
    if (password) {
      setUserRole('admin');
      setIsPasswordModalOpen(false);
    }
  };
  
  const handleRoleSwitch = () => {
    if (userRole === 'guest') {
        setIsPasswordModalOpen(true);
    } else {
        setUserRole('guest');
        setGuestBookingId(null);
    }
  }

  const guestBooking = guestBookingId ? bookings.find(b => b.id === guestBookingId) : undefined;
  const guestRoom = guestBooking ? rooms.find(r => r.id === guestBooking.roomNumber) : undefined;
  
  const renderAdminView = () => {
      switch(activeView) {
          case 'dashboard':
              return <Dashboard bookings={bookings} rooms={rooms} />;
          case 'bookings':
              return <BookingList bookings={bookings} onDeleteBooking={deleteBooking} />;
          case 'new_booking':
              return <BookingForm onAddBooking={addBooking} allBookings={bookings} />;
          case 'rooms':
              return <RoomsView />;
          default:
              return <Dashboard bookings={bookings} rooms={rooms} />;
      }
  }

  const renderGuestView = () => {
    if (guestBooking && guestRoom) {
      return (
        <GuestBookingView 
            booking={guestBooking} 
            room={guestRoom} 
            onNewBooking={() => setGuestBookingId(null)} 
            onUpdateBooking={updateBookingDetails}
        />
      );
    }
    return <BookingForm onAddBooking={addBooking} allBookings={bookings} />;
  }
  
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {userRole === 'admin' && (
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onSwitchRole={handleRoleSwitch}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center bg-white p-4 border-b border-gray-200 shadow-sm z-10">
            <div className="flex items-center gap-3">
                {userRole === 'admin' && (
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-600 hover:text-gray-900">
                        {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                    </button>
                )}
                <div className="flex items-center gap-3">
                    <HotelIcon className="h-8 w-8 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-800">
                      {userRole === 'admin' ? 'Admin Panel' : 'Hotel Booking'}
                    </h1>
                </div>
            </div>
            
            <button onClick={handleRoleSwitch} className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">
              {userRole === 'admin' ? <LogoutIcon className="h-5 w-5" /> : <LockIcon className="h-5 w-5" />}
              <span>{userRole === 'admin' ? 'Guest View' : 'Admin Login'}</span>
            </button>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {userRole === 'admin' ? renderAdminView() : renderGuestView()}
        </main>
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