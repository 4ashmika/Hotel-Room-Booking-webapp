import React, { useState } from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { UsersIcon } from './icons/UsersIcon';
import { BedIcon } from './icons/BedIcon';
import { WifiIcon } from './icons/WifiIcon';
import { TvIcon } from './icons/TvIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const AmenityIcon = ({ amenity }) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <WifiIcon className="h-5 w-5 text-blue-500" />;
    if (lowerAmenity.includes('tv')) return <TvIcon className="h-5 w-5 text-blue-500" />;
    return <SparklesIcon className="h-5 w-5 text-blue-500" />;
};

export const RoomDetails = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div className="my-6 p-4 border border-gray-200 rounded-lg bg-gray-100/60 space-y-4">
      <div className="relative">
        <img src={room.images[currentImageIndex]} alt={room.name} className="w-full h-48 object-cover rounded-lg" />
        {room.images.length > 1 && (
          <>
            <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next image"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{room.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{room.description}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
          <UsersIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <span className="text-gray-700">Sleeps {room.capacity}</span>
        </div>
         <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
          <BedIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <span className="text-gray-700">{room.beds.map(b => `${b.count} ${b.type}`).join(', ')}</span>
        </div>
        {room.amenities.slice(0, 2).map(amenity => (
            <div key={amenity} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                <AmenityIcon amenity={amenity} />
                <span className="text-gray-700">{amenity}</span>
            </div>
        ))}
      </div>
    </div>
  );
};
