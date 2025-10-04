
import React, { useState } from 'react';
import { CalendarPlusIcon } from './icons/CalendarPlusIcon';
import { SearchIcon } from './icons/SearchIcon';
import { rooms } from '../data/rooms';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

type WelcomeViewProps = {
  onNewBookingClick: () => void;
  onFindBookingClick: () => void;
};

const featuredRooms = rooms.filter(room => ['305', '412'].includes(room.id));

const signatureAmenities = [
    {
        icon: <CheckCircleIcon className="h-6 w-6 text-blue-600" />,
        title: "High-Speed WiFi",
        description: "Stay connected with complimentary ultra-fast internet access in all rooms and public areas."
    },
    {
        icon: <CheckCircleIcon className="h-6 w-6 text-blue-600" />,
        title: "Premium Comfort",
        description: "Relax in style with our luxurious bedding, plush towels, and premium in-room amenities."
    },
    {
        icon: <CheckCircleIcon className="h-6 w-6 text-blue-600" />,
        title: "24/7 Front Desk",
        description: "Our dedicated team is available around the clock to assist you with any needs or requests."
    },
    {
        icon: <CheckCircleIcon className="h-6 w-6 text-blue-600" />,
        title: "Daily Housekeeping",
        description: "Enjoy a pristine and comfortable environment with our meticulous daily cleaning services."
    }
];

const FeaturedRoomCard = ({ room }: { room: typeof featuredRooms[0] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group transition-transform transform hover:-translate-y-1">
      <div className="relative">
        <img src={room.images[currentImageIndex]} alt={room.name} className="w-full h-56 object-cover" />

        {room.images.length > 1 && (
          <>
            <button 
              onClick={prevImage} 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/70 focus:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none z-10"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/70 focus:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none z-10"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
            
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {room.images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            currentImageIndex === index ? 'bg-white scale-110' : 'bg-white/50'
                        }`}
                        aria-label={`Image ${index + 1}`}
                    />
                ))}
            </div>
          </>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
        <p className="text-sm text-gray-500 mt-1">Room {room.id}</p>
        <p className="text-lg font-bold text-gray-900 mt-4">
          ${room.pricePerNight}<span className="text-sm font-medium text-gray-500">/night</span>
        </p>
      </div>
    </div>
  );
};

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onNewBookingClick, onFindBookingClick }) => {
  return (
    <div className="space-y-12 p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Experience Unforgettable Stays
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Your perfect getaway starts here. Book your stay with us and experience unparalleled comfort and luxury.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
                onClick={onNewBookingClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all border-b-4 border-blue-800 hover:border-blue-700 active:translate-y-0.5 active:border-b-2"
            >
                <CalendarPlusIcon className="h-5 w-5" />
                Book a New Stay
            </button>
            <button
                onClick={onFindBookingClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all border border-gray-300"
            >
                <SearchIcon className="h-5 w-5" />
                Find My Reservation
            </button>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Featured Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {featuredRooms.map(room => (
            <FeaturedRoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
      
      {/* Signature Amenities Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Signature Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {signatureAmenities.map(amenity => (
                <div key={amenity.title} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                        {amenity.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{amenity.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};
