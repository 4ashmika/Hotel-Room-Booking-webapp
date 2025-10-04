
export interface Bed {
  type: string;
  count: number;
}

export interface Room {
  id: string;
  name: string;
  images: string[];
  pricePerNight: number;
  description: string;
  capacity: number;
  beds: Bed[];
  amenities: string[];
}

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
