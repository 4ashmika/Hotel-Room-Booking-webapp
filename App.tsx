

import React, { useState, useEffect } from 'react';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { GuestBookingView } from './components/GuestBookingView';
import { PasswordModal } from './components/PasswordModal';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RoomsView } from './components/RoomsView';
import { MenuIcon } from './components/icons/MenuIcon';
import { HotelIcon } from './components/icons/HotelIcon';
import { XIcon } from './components/icons/XIcon';
import { LockIcon } from './components/icons/LockIcon';
import { LogoutIcon } from './components/icons/LogoutIcon';
import { FindBookingView } from './components/FindBookingView';
import { GuestSidebar } from './components/GuestSidebar';
import { WelcomeView } from './components/WelcomeView';
import { RoomForm } from './components/RoomForm';
import { Room, Booking } from './types';

type AdminView = 'dashboard' | 'bookings' | 'new_booking' | 'rooms' | 'add_room' | 'edit_room';
type GuestView = 'welcome' | 'new_booking' | 'find_booking';

function App() {
  const [rooms, setRooms] = useState<Room[]>([
    { 
      id: '101', 
      name: 'Standard Single', 
      images: [
          'https://placehold.co/800x600/a3c9e8/ffffff?text=Cozy+Single+Bed',
          'https://placehold.co/800x600/b3d9f8/ffffff?text=Modern+Bathroom',
          'https://placehold.co/800x600/c3e9ff/ffffff?text=Work+Desk+View',
      ],
      pricePerNight: 150,
      description: 'A cozy and compact room perfect for solo travelers. Features a comfortable single bed, a work desk, and an en-suite bathroom with a shower.',
      capacity: 1,
      beds: [{ type: 'Single', count: 1 }],
      amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV'],
    },
    { 
      id: '205', 
      name: 'Deluxe Double', 
      images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop',
      ],
      pricePerNight: 250,
      description: 'Spacious and elegantly furnished, this room offers two double beds, making it ideal for families or friends. Enjoy city views and a modern bathroom.',
      capacity: 4,
      beds: [{ type: 'Double', count: 2 }],
      amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini-bar'],
    },
    { 
      id: '305', 
      name: 'Luxury Suite', 
      images: [
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1560185893-a55de8537e49?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?q=80&w=800&auto=format&fit=crop',
      ],
      pricePerNight: 450,
      description: 'Experience ultimate comfort in our Luxury Suite. Featuring a separate living area, a king-sized bed, and a spa-like bathroom with a soaking tub.',
      capacity: 2,
      beds: [{ type: 'King', count: 1 }],
      amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini-bar', 'Room Service'],
    },
    { 
      id: '412', 
      name: 'Penthouse View', 
      images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1594563703937-fdc640497dcd?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=800&auto=format&fit=crop',
      ],
      pricePerNight: 750,
      description: 'The pinnacle of luxury. Our Penthouse offers breathtaking panoramic city views from a private terrace, a spacious living room, and a master bedroom with a plush king bed.',
      capacity: 3,
      beds: [{ type: 'King', count: 1 }, { type: 'Sofa Bed', count: 1 }],
      amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini-bar', 'Room Service', 'Private Terrace'],
    },
  ]);
  const [bookings, setBookings] = useState<Booking[]>([
    { id: '1', guestName: 'Alice Johnson', customerPhoneNumber: '1112223333', customerEmail: 'alice@example.com', customerId: 'AB123456', roomNumber: '305', checkInDate: '2024-08-10', checkOutDate: '2024-08-15', totalPrice: 2250 },
    { id: '2', guestName: 'Bob Williams', customerPhoneNumber: '4445556666', customerEmail: 'bob@example.com', customerId: 'CD789012', roomNumber: '412', checkInDate: '2024-08-12', checkOutDate: '2024-08-18', totalPrice: 4500 },
    { id: '3', guestName: 'Charlie Brown', customerPhoneNumber: '7778889999', customerEmail: 'charlie@example.com', customerId: 'EF345678', roomNumber: '305', checkInDate: '2024-09-20', checkOutDate: '2024-09-25', totalPrice: 2250 },
  ]);

  const [userRole, setUserRole] = useState('guest');
  const [guestBookingId, setGuestBookingId] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [guestView, setGuestView] = useState<GuestView>('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  useEffect(() => {
    if (userRole === 'guest') {
        setGuestView('welcome');
        setIsSidebarOpen(false);
    } else {
        setActiveView('dashboard');
        setIsSidebarOpen(false);
    }
  }, [userRole]);

  // FIX: Added an explicit return type to the function to resolve TypeScript inference errors.
  const addBooking = (newBookingData: Omit<Booking, 'id'>): Promise<{ error: string | null; bookingId: string | null; }> => {
    return new Promise((resolve) => {
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

        resolve({ error: null, bookingId: newBookingWithId.id });
      }, 1500);
    });
  };
  
  const deleteBooking = (bookingId: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
            resolve({ success: true });
        }, 1000);
    });
  };
  
  const updateBookingDetails = (bookingId: string, updatedDetails: Partial<Booking>) => {
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
  
  const findBooking = (details: { guestName: string; customerPhoneNumber: string }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const { guestName, customerPhoneNumber } = details;
            const found = bookings.find(b =>
                b.guestName.trim().toLowerCase() === guestName.trim().toLowerCase() &&
                b.customerPhoneNumber.trim() === customerPhoneNumber.trim()
            );

            if (found) {
                setGuestBookingId(found.id);
                resolve({ success: true });
            } else {
                resolve({ error: 'No booking found with the provided details. Please check the name and phone number.' });
            }
        }, 1000);
    });
  };

  const addRoom = async (newRoomData: Room) => {
    setRooms(prev => [...prev, newRoomData]);
    setActiveView('rooms');
  };
  
  const updateRoom = async (updatedRoomData: Room) => {
    setRooms(prev => prev.map(r => r.id === updatedRoomData.id ? updatedRoomData : r));
    setActiveView('rooms');
    setEditingRoom(null);
  };
  
  const deleteRoom = (roomId: string) => {
    const roomHasBookings = bookings.some(b => b.roomNumber === roomId);
    if (roomHasBookings) {
        alert('This room has active bookings and cannot be deleted.');
        return;
    }
    setRooms(prev => prev.filter(r => r.id !== roomId));
  };

  const handleLogin = (password: string) => {
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
              return <BookingList bookings={bookings} onDeleteBooking={deleteBooking} rooms={rooms} />;
          case 'new_booking':
              return <BookingForm onAddBooking={addBooking} allBookings={bookings} rooms={rooms} />;
          case 'rooms':
              return <RoomsView 
                        rooms={rooms}
                        bookings={bookings}
                        onAddNewRoom={() => {
                            setEditingRoom(null);
                            setActiveView('add_room');
                        }}
                        onEditRoom={(room) => {
                            setEditingRoom(room);
                            setActiveView('edit_room');
                        }}
                        onDeleteRoom={deleteRoom}
                    />;
            case 'add_room':
                return <RoomForm 
                    onSave={addRoom}
                    onCancel={() => setActiveView('rooms')}
                />;
            case 'edit_room':
                return <RoomForm 
                    initialRoom={editingRoom}
                    onSave={updateRoom}
                    onCancel={() => {
                        setActiveView('rooms');
                        setEditingRoom(null);
                    }}
                />;
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
            onNewBooking={() => {
                setGuestBookingId(null);
                setGuestView('welcome');
            }} 
            onUpdateBooking={updateBookingDetails}
        />
      );
    }
    
    switch (guestView) {
        case 'welcome':
            return <WelcomeView 
                onNewBookingClick={() => setGuestView('new_booking')} 
                onFindBookingClick={() => setGuestView('find_booking')}
                rooms={rooms} 
            />;
        case 'find_booking':
            return <FindBookingView onFindBooking={findBooking} />;
        case 'new_booking':
        default:
            return <BookingForm onAddBooking={addBooking} allBookings={bookings} rooms={rooms} />;
    }
  }
  
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {userRole === 'admin' ? (
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      ) : (
        <GuestSidebar 
          activeView={guestView}
          setActiveView={setGuestView}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center bg-white p-4 border-b border-gray-200 shadow-sm z-10">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                    aria-label="Toggle sidebar"
                >
                    {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
                <div className="flex items-center gap-3">
                    <HotelIcon className="h-8 w-8 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-800">
                      {userRole === 'admin' ? 'Admin Panel' : 'Hotel Booking'}
                    </h1>
                </div>
            </div>
            
            <button
                onClick={handleRoleSwitch}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
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
