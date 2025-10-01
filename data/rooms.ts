
export const rooms = [
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
];