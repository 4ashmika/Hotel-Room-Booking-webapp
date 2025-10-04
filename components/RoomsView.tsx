

import React, { useState } from 'react';
import { UsersIcon } from './icons/UsersIcon';
import { BedIcon } from './icons/BedIcon';
import { Room, Booking } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ConfirmationModal } from './ConfirmationModal';

interface RoomsViewProps {
  rooms: Room[];
  bookings: Booking[];
  onAddNewRoom: () => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({ rooms, bookings, onAddNewRoom, onEditRoom, onDeleteRoom }) => {
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const handleDeleteClick = (room: Room) => {
    const roomHasBookings = bookings.some(b => b.roomNumber === room.id);
    if (roomHasBookings) {
        alert('This room has active bookings and cannot be deleted.');
        return;
    }
    setRoomToDelete(room);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
        onDeleteRoom(roomToDelete.id);
        setRoomToDelete(null);
    }
  };

  return (
    <>
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Hotel Rooms</h1>
        <button
          onClick={onAddNewRoom}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all border-b-4 border-blue-800 hover:border-blue-700 active:translate-y-0.5 active:border-b-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Room
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group flex flex-col">
            <div className="relative">
                <img src={room.images[0] || 'https://placehold.co/800x600/e2e8f0/4a5568?text=No+Image'} alt={room.name} className="w-full h-56 object-cover" />
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold py-1 px-3 rounded-full">
                    ROOM {room.id}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
              <p className="text-sm text-gray-500 mt-1 flex-grow">{room.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2"><UsersIcon className="h-5 w-5 text-blue-500" /> Sleeps {room.capacity}</span>
                    <span className="flex items-center gap-2"><BedIcon className="h-5 w-5 text-blue-500" /> {room.beds.map(b => `${b.count} ${b.type}`).join(', ')}</span>
                </div>
                 <p className="text-lg font-bold text-gray-900">
                    ${room.pricePerNight}<span className="text-sm font-medium text-gray-500">/night</span>
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                    onClick={() => onEditRoom(room)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors py-1.5 px-3 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    <PencilIcon className="h-4 w-4" /> Edit
                </button>
                 <button 
                    onClick={() => handleDeleteClick(room)}
                    className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors py-1.5 px-3 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    <TrashIcon className="h-4 w-4" /> Delete
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    {roomToDelete && (
        <ConfirmationModal
            isOpen={!!roomToDelete}
            onClose={() => setRoomToDelete(null)}
            onConfirm={confirmDelete}
            title="Confirm Room Deletion"
            message={`Are you sure you want to delete ${roomToDelete.name} (Room ${roomToDelete.id})? This action cannot be undone.`}
            isLoading={false}
        />
    )}
    </>
  );
};
