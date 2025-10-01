import React, { useState, useMemo } from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { ConfirmationModal } from './ConfirmationModal';
import { BookingDetailsModal } from './BookingDetailsModal';
import { rooms } from '../data/rooms';
import { SortIcon } from './icons/SortIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

export const BookingList = ({ bookings, onDeleteBooking }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const [sortConfig, setSortConfig] = useState({ key: 'checkInDate', direction: 'asc' });
  
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
  }, [bookings, sortConfig, filterRoom, filterMonth]);

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

  const SortableHeader = ({ sortKey, children }) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
        <button onClick={() => requestSort(sortKey)} className="flex items-center gap-2 hover:text-slate-900 transition-colors">
            {children}
            <SortIcon className="h-4 w-4" direction={sortConfig.key === sortKey ? sortConfig.direction : undefined} />
        </button>
    </th>
  );

  return (
    <>
      <div className="bg-sky-50/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-200 w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Current Bookings</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
                <label htmlFor="room-filter" className="block text-sm font-medium text-slate-600 mb-1">Filter by Room</label>
                <div className="relative">
                    <select 
                        id="room-filter" 
                        value={filterRoom}
                        onChange={(e) => setFilterRoom(e.target.value)}
                        className="w-full appearance-none pl-3 pr-10 py-3 bg-sky-100/50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    >
                        <option value="">All Rooms</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>
                                Room {room.id} - {room.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
            </div>
            <div className="flex-1">
                <label htmlFor="month-filter" className="block text-sm font-medium text-slate-600 mb-1">Filter by Month</label>
                <div className="relative">
                    <select 
                        id="month-filter"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="w-full appearance-none pl-3 pr-10 py-3 bg-sky-100/50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    >
                        <option value="">All Months</option>
                        {availableMonths.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                     <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
            {filteredAndSortedBookings.length > 0 ? (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-sky-100">
                    <tr>
                      <SortableHeader sortKey="guestName">Guest Name</SortableHeader>
                      <SortableHeader sortKey="roomNumber">Room Number</SortableHeader>
                      <SortableHeader sortKey="checkInDate">Check-in Date</SortableHeader>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Check-out Date
                      </th>
                      <SortableHeader sortKey="totalPrice">Total Price</SortableHeader>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-slate-200">
                    {filteredAndSortedBookings.map((booking) => (
                      <tr 
                        key={booking.id} 
                        onClick={() => openDetailsModal(booking)}
                        className="hover:bg-sky-100/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.guestName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{booking.roomNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatDate(booking.checkInDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatDate(booking.checkOutDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{booking.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-center">
                          <button 
                            onClick={(e) => openConfirmationModal(e, booking)}
                            className="p-2 rounded-full text-slate-500 hover:bg-red-500/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-red-500 transition-colors"
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
                 <p className="text-slate-500 text-center py-8">
                    {bookings.length === 0 ? "No rooms are booked yet." : "No bookings match the current filters."}
                </p>
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