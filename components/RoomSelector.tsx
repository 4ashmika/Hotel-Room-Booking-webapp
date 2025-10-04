import React from 'react';
import { CheckIcon } from './icons/CheckIcon';

export const RoomSelector = ({ rooms, selectedRoomId, onSelectRoom }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {rooms.map(room => {
        const isSelected = selectedRoomId === room.id;
        return (
          <button
            type="button"
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`
              relative rounded-lg overflow-hidden group
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
              transition-all duration-300 transform hover:-translate-y-1
              ${isSelected 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'ring-1 ring-gray-200 hover:ring-blue-400'
              }
            `}
            aria-pressed={isSelected}
          >
            <img src={room.images[0]} alt={room.name} className="w-full h-24 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            {isSelected && (
              <div className="absolute inset-0 bg-blue-500/30"></div>
            )}

            <div className="absolute bottom-0 left-0 p-3 text-left w-full">
              <h3 className="font-bold text-white text-sm truncate">{room.name}</h3>
              <p className="text-xs text-gray-300">Room {room.id}</p>
              <p className="text-sm text-white font-bold mt-1">${room.pricePerNight} <span className="font-normal text-gray-200">/ night</span></p>
            </div>
            
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-lg border-2 border-white">
                <CheckIcon className="h-4 w-4" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  );
};
