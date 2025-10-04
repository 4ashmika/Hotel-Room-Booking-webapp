import React, { useState, useMemo } from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { ConfirmationModal } from './ConfirmationModal';
import { BookingDetailsModal } from './BookingDetailsModal';
import { rooms } from '../data/rooms';
import { SortIcon } from './icons/SortIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { SearchIcon } from './icons/SearchIcon';

export const BookingList = ({ bookings, onDeleteBooking }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const [sortConfig, setSortConfig] = useState({ key: 'checkInDate', direction: 'asc' });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const availableMonths = useMemo(() => {
    // FIX: Explicitly type the Set to avoid its elements being inferred as 'unknown'.
    const monthSet = new Set<string>();
    bookings.forEach(booking => {
        const checkIn = new Date(booking.checkInDate);
        // Adjust for timezone when creating the date object to avoid month shifts
        const utcDate = new Date(checkIn.getUTCFullYear(), checkIn.getUTCMonth(), checkIn.getUTCDate());
        const month = utcDate.getMonth();
        const year = utcDate.getFullYear();
        monthSet.add(`${year}-${month}`);
    });

    const monthArray = Array.from(monthSet).map(m => {
        const [year, month] = m.split('-').map(Number);
        return {
            value: m,
            label: new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })
        };
    });

    // Sort months chronologically
    monthArray.sort((a, b) => {
        const [yearA, monthA] = a.value.split('-').map(Number);
        const [yearB, monthB] = b.value.split('-').map(Number);
        return yearA - yearB || monthA - monthB;
    });

    return monthArray;
  }, [bookings]);

  const filteredAndSortedBookings = useMemo(() => {
    let filteredItems = [...bookings];
    
    if (searchQuery) {
        filteredItems = filteredItems.filter(b => 
            b.guestName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    if (filterRoom) {
        filteredItems = filteredItems.filter(b => b.roomNumber === filterRoom);
    }
    if (filterMonth) {
        const [year, month] = filterMonth.split('-').map(Number);
        filteredItems = filteredItems.filter(b => {
            const checkIn = new Date(b.checkInDate);
            const utcDate = new Date(checkIn.getUTCFullYear(), checkIn.getUTCMonth(), checkIn.getUTCDate());
            return utcDate.getFullYear() === year && utcDate.getMonth() === month;
        });
    }

    if (sortConfig.key) {
        filteredItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
    return filteredItems;
  }, [bookings, sortConfig, filterRoom, filterMonth, searchQuery]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const openConfirmationModal = (e, booking) => {
    e.stopPropagation(); // Prevent row click from triggering
    setBookingToDelete(booking);
    setIsDeleteModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setBookingToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (bookingToDelete) {
      onDeleteBooking(bookingToDelete.id);
      closeConfirmationModal();
    }
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedBooking(null);
    setIsDetailsModalOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + (offset*60*1000));
    return adjustedDate.toLocaleDateString('en-CA');
  };
  
  const selectedRoom = selectedBooking ? rooms.find(r => r.id === selectedBooking.roomNumber) || null : null;

  // FIX: Defined a props type for SortableHeader to resolve an incorrect "children is missing" error.
  type SortableHeaderProps = { sortKey: string; children: React.ReactNode; };
  // FIX: Explicitly typing the SortableHeader as a React.FC to correctly handle children props and resolve TypeScript errors.
  const SortableHeader: React.FC<SortableHeaderProps> = ({ sortKey, children }) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <button onClick={() => requestSort(sortKey)} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
            {children}
            <SortIcon className="h-4 w-4" direction={sortConfig.key === sortKey ? sortConfig.direction : undefined} />
        </button>
    </th>
  );

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Current Bookings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
                <label htmlFor="search-guest" className="block text-sm font-medium text-gray-600 mb-1">Search by Guest</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="text"
                        id="search-guest"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter guest name..."
                        className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="room-filter" className="block text-sm font-medium text-gray-600 mb-1">Filter by Room</label>
                <div className="relative">
                    <select 
                        id="room-filter" 
                        value={filterRoom}
                        onChange={(e) => setFilterRoom(e.target.value)}
                        className="w-full appearance-none pl-3 pr-10 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                        <option value="">All Rooms</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>
                                Room {room.id} - {room.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <div>
                <label htmlFor="month-filter" className="block text-sm font-medium text-gray-600 mb-1">Filter by Month</label>
                <div className="relative">
                    <select 
                        id="month-filter"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="w-full appearance-none pl-3 pr-10 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                        <option value="">All Months</option>
                        {availableMonths.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                     <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
            {filteredAndSortedBookings.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortableHeader sortKey="guestName">Guest Name</SortableHeader>
                      <SortableHeader sortKey="roomNumber">Room</SortableHeader>
                      <SortableHeader sortKey="checkInDate">Check-in</SortableHeader>
                       <SortableHeader sortKey="checkOutDate">Check-out</SortableHeader>
                      <SortableHeader sortKey="totalPrice">Price</SortableHeader>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredAndSortedBookings.map((booking) => (
                      <tr 
                        key={booking.id} 
                        onClick={() => openDetailsModal(booking)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.guestName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.roomNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(booking.checkInDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(booking.checkOutDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{booking.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                          <button 
                            onClick={(e) => openConfirmationModal(e, booking)}
                            className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            aria-label={`Delete booking for ${booking.guestName}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            ) : (
                 <div className="text-gray-500 text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium">{bookings.length === 0 ? "No rooms are booked yet." : "No bookings match filters."}</h3>
                    <p className="text-sm mt-1">{bookings.length === 0 ? "Create a new booking to get started." : "Try adjusting your search or filters."}</p>
                </div>
            )}
        </div>
      </div>
      {bookingToDelete && (
         <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={closeConfirmationModal}
            onConfirm={handleConfirmDelete}
            title="Confirm Deletion"
            message={`Are you sure you want to delete the booking for ${bookingToDelete.guestName} in Room ${bookingToDelete.roomNumber}? This action cannot be undone.`}
        />
      )}
      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        booking={selectedBooking}
        room={selectedRoom}
      />
    </>
  );
};