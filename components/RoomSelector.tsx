import React from 'react';
import type { Room } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({ rooms, selectedRoomId, onSelectRoom }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {rooms.map(room => (
        <button
          type="button"
          key={room.id}
          onClick={() => onSelectRoom(room.id)}
          className={`relative rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-1 ${selectedRoomId === room.id ? 'ring-2 ring-blue-500 scale-105' : 'ring-1 ring-slate-700 hover:ring-blue-500'}`}
          aria-pressed={selectedRoomId === room.id}
        >
          <img src={room.images[0]} alt={room.name} className="w-full h-24 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {/* Add a blue tint overlay when selected */}
          {selectedRoomId === room.id && (
            <div className="absolute inset-0 bg-blue-500/30"></div>
          )}

          <div className="absolute bottom-0 left-0 p-2 text-left">
            <h3 className="font-bold text-white text-sm">{room.name}</h3>
            <p className="text-xs text-slate-300">Room {room.id}</p>
            <p className="text-xs text-slate-200 font-semibold">${room.pricePerNight} / night</p>
          </div>
          
          {selectedRoomId === room.id && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
              <CheckIcon className="h-4 w-4" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};