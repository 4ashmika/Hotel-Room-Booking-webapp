import React, { useState, useEffect } from 'react';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MailIcon } from './icons/MailIcon';
import { IdIcon } from './icons/IdIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CheckIcon } from './icons/CheckIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

export const GuestBookingView = ({ booking, room, onNewBooking, onUpdateBooking }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableDetails, setEditableDetails] = useState({
      guestName: '',
      customerPhoneNumber: '',
      customerEmail: '',
      customerId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking) {
        setEditableDetails({
            guestName: booking.guestName,
            customerPhoneNumber: booking.customerPhoneNumber,
            customerEmail: booking.customerEmail,
            customerId: booking.customerId,
        });
    }
  }, [booking]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + offset * 60000);
    return adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setEditableDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateDetails = () => {
    const { guestName, customerPhoneNumber, customerEmail, customerId } = editableDetails;
    if (!guestName.trim() || !customerPhoneNumber.trim() || !customerEmail.trim() || !customerId.trim()) {
        setError('Please fill all guest detail fields.');
        return false;
    }
    if (!/^\d{10}$/.test(customerPhoneNumber)) {
        setError('Please enter a valid 10-digit phone number.');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        setError('Please enter a valid email address.');
        return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    setError('');
    if (!validateDetails()) return;
    
    setIsLoading(true);
    await onUpdateBooking(booking.id, editableDetails);
    setIsLoading(false);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setError('');
    setEditableDetails({
        guestName: booking.guestName,
        customerPhoneNumber: booking.customerPhoneNumber,
        customerEmail: booking.customerEmail,
        customerId: booking.customerId,
    });
    setIsEditing(false);
  }

  const StaticDetail = ({ icon, value }) => (
    <div className="flex items-center gap-3 text-sm">
        {icon}
        <span className="text-slate-600">{value}</span>
    </div>
  );

  const EditableDetail = ({ icon, name, value, placeholder }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
        </div>
        <input 
            type="text"
            name={name}
            value={value}
            onChange={handleDetailChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 bg-sky-100 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
        />
    </div>
  );

  return (
    <div className="bg-sky-50/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl">
        <div className="text-center">
             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
                <CheckIcon className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Your Booking is Confirmed!</h2>
            <p className="text-slate-500 mt-2">Thank you, {booking.guestName}. Please review your reservation details below.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2 mb-3">Reservation Details</h3>
                    <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-sky-500 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500">Check-in</p>
                                <p className="font-bold text-slate-800">{formatDate(booking.checkInDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-sky-500 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500">Check-out</p>
                                <p className="font-bold text-slate-800">{formatDate(booking.checkOutDate)}</p>
                            </div>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                            <p className="text-sm text-slate-500">Total Price</p>
                            <p className="text-3xl font-bold text-slate-900">{booking.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                        <h3 className="font-bold text-lg text-slate-800">Guest Information</h3>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors py-1 px-3 rounded-lg hover:bg-sky-100">
                                <PencilIcon className="h-4 w-4" />
                                Edit Details
                            </button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {isEditing ? (
                            <>
                                <EditableDetail icon={<UserIcon className="h-5 w-5 text-slate-400" />} name="guestName" value={editableDetails.guestName} placeholder="Full Name" />
                                <EditableDetail icon={<PhoneIcon className="h-5 w-5 text-slate-400" />} name="customerPhoneNumber" value={editableDetails.customerPhoneNumber} placeholder="Phone Number" />
                                <EditableDetail icon={<MailIcon className="h-5 w-5 text-slate-400" />} name="customerEmail" value={editableDetails.customerEmail} placeholder="Email Address" />
                                <EditableDetail icon={<IdIcon className="h-5 w-5 text-slate-400" />} name="customerId" value={editableDetails.customerId} placeholder="National ID" />
                            </>
                        ) : (
                            <>
                                <StaticDetail icon={<UserIcon className="h-5 w-5 text-slate-500" />} value={booking.guestName} />
                                <StaticDetail icon={<PhoneIcon className="h-5 w-5 text-slate-500" />} value={booking.customerPhoneNumber} />
                                <StaticDetail icon={<MailIcon className="h-5 w-5 text-slate-500" />} value={booking.customerEmail} />
                                <StaticDetail icon={<IdIcon className="h-5 w-5 text-slate-500" />} value={`ID: ${booking.customerId}`} />
                            </>
                        )}
                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                    </div>
                     {isEditing && (
                        <div className="flex items-center gap-4 mt-6">
                            <button onClick={handleSaveChanges} disabled={isLoading} className="w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors disabled:bg-slate-400">
                                {isLoading ? <SpinnerIcon className="h-5 w-5" /> : 'Save Changes'}
                            </button>
                            <button onClick={handleCancel} className="w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors">
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div>
                 <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2 mb-3">Room Details</h3>
                 <img src={room.images[0]} alt={room.name} className="w-full h-48 object-cover rounded-lg mb-4"/>
                 <h4 className="font-bold text-xl text-slate-900">{room.name}</h4>
                 <p className="text-sm text-slate-500">Room {room.id}</p>
                 <p className="text-sm text-slate-600 mt-2">{room.description}</p>
            </div>
        </div>
        {!isEditing && (
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <button 
                    onClick={onNewBooking}
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-8 py-3 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                >
                    Make Another Booking
                </button>
            </div>
        )}
    </div>
  );
};