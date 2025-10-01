export interface Booking {
  id: string;
  guestName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  customerId: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
}

export interface Room {
  id: string; // This will be the room number, e.g., '101'
  name: string;
  images: string[];
  pricePerNight: number;
  description: string;
  capacity: number;
  beds: { type: string; count: number }[];
  amenities: string[];
}