import React from 'react';
import { rooms } from '../data/rooms';
import { UsersIcon } from './icons/UsersIcon';
import { BedIcon } from './icons/BedIcon';

export const RoomsView = () => {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Hotel Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group transition-transform transform hover:-translate-y-1">
            <div className="relative">
                <img src={room.images[0]} alt={room.name} className="w-full h-56 object-cover" />
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold py-1 px-3 rounded-full">
                    ROOM {room.id}
                </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{room.description}</p>
              
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
          </div>
        ))}
      </div>
    </div>
  );
};