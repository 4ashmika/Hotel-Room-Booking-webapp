import React, { useState } from 'react';
import type { Room } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { UsersIcon } from './icons/UsersIcon';
import { BedIcon } from './icons/BedIcon';
import { WifiIcon } from './icons/WifiIcon';
import { TvIcon } from './icons/TvIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface RoomDetailsProps {
  room: Room;
}

const AmenityIcon: React.FC<{ amenity: string }> = ({ amenity }) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <WifiIcon className="h-5 w-5 text-cyan-400" />;
    if (lowerAmenity.includes('tv')) return <TvIcon className="h-5 w-5 text-cyan-400" />;
    return <SparklesIcon className="h-5 w-5 text-cyan-400" />;
};

export const RoomDetails: React.FC<RoomDetailsProps> = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div className="my-6 p-4 border border-slate-200 rounded-lg bg-sky-100/70 space-y-4">
      <div className="relative">
        <img src={room.images[currentImageIndex]} alt={room.name} className="w-full h-48 object-cover rounded-lg" />
        {room.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80 transition-colors" aria-label="Previous image">
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80 transition-colors" aria-label="Next image">
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">{room.name}</h3>
        <p className="text-sm text-slate-600 mt-1">{room.description}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2 p-3 bg-sky-200/60 rounded-lg">
          <UsersIcon className="h-5 w-5 text-cyan-400 flex-shrink-0" />
          <span className="text-slate-700">Sleeps {room.capacity}</span>
        </div>
         <div className="flex items-center gap-2 p-3 bg-sky-200/60 rounded-lg">
          <BedIcon className="h-5 w-5 text-cyan-400 flex-shrink-0" />
          <span className="text-slate-700">{room.beds.map(b => `${b.count} ${b.type}`).join(', ')}</span>
        </div>
        {room.amenities.slice(0, 2).map(amenity => (
            <div key={amenity} className="flex items-center gap-2 p-3 bg-sky-200/60 rounded-lg">
                <AmenityIcon amenity={amenity} />
                <span className="text-slate-700">{amenity}</span>
            </div>
        ))}
      </div>
    </div>
  );
};