export interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface Room {
  id: string; // This will be the room number, e.g., '101'
  name: string;
  image: string;
}
