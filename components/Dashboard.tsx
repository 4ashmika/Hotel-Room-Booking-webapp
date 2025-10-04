import React, { useMemo } from 'react';
import { UserIcon } from './icons/UserIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CashIcon } from './icons/CashIcon';
import { BedIcon } from './icons/BedIcon';


// FIX: Added explicit prop types to StatCard for better type safety.
const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode; }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transition-transform transform hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <p className="text-sm text-gray-500 uppercase font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="p-3 bg-blue-100 rounded-xl">
        {icon}
      </div>
    </div>
  </div>
);

// FIX: Extracted ActivityItem props to a dedicated type to resolve TS errors related to the `key` prop.
type ActivityItemProps = { booking: any; type: 'check-in' | 'check-out'; };
// FIX: Explicitly typing the ActivityItem as a React.FC to correctly handle the `key` prop and resolve TypeScript errors.
const ActivityItem: React.FC<ActivityItemProps> = ({ booking, type }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-full">
                <UserIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div>
                <p className="font-semibold text-gray-800 text-sm">{booking.guestName}</p>
                <p className="text-xs text-gray-500">Room {booking.roomNumber}</p>
            </div>
        </div>
        <p className={`text-sm font-medium ${type === 'check-in' ? 'text-green-600' : 'text-red-600'}`}>
            {type === 'check-in' ? formatDate(booking.checkInDate) : formatDate(booking.checkOutDate)}
        </p>
    </div>
);

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    // Simple check if it's today
    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }
    return date.toLocaleDateString('en-CA');
};


export const Dashboard = ({ bookings, rooms }) => {

    const {
        totalRevenue,
        occupancyRate,
        todaysCheckIns,
        todaysCheckOuts
    } = useMemo(() => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        let revenue = 0;
        let occupiedTodayCount = 0;
        const checkIns = [];
        const checkOuts = [];

        bookings.forEach(booking => {
            revenue += booking.totalPrice;
            const checkInDate = new Date(booking.checkInDate);
            const checkOutDate = new Date(booking.checkOutDate);

            if (today >= checkInDate && today < checkOutDate) {
                occupiedTodayCount++;
            }
            if (booking.checkInDate === todayStr) {
                checkIns.push(booking);
            }
            if (booking.checkOutDate === todayStr) {
                checkOuts.push(booking);
            }
        });

        const rate = rooms.length > 0 ? ((occupiedTodayCount / rooms.length) * 100).toFixed(0) : 0;
        
        return {
            totalRevenue: revenue,
            occupancyRate: `${rate}%`,
            todaysCheckIns: checkIns,
            todaysCheckOuts: checkOuts
        };

    }, [bookings, rooms]);
  

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value={bookings.length} icon={<CalendarIcon className="h-6 w-6 text-blue-600" />} />
        <StatCard title="Total Revenue" value={totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} icon={<CashIcon className="h-6 w-6 text-blue-600" />} />
        <StatCard title="Occupancy Today" value={occupancyRate} icon={<BedIcon className="h-6 w-6 text-blue-600" />} />
        <StatCard title="Today's Check-ins" value={todaysCheckIns.length} icon={<UserIcon className="h-6 w-6 text-blue-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Check-ins</h2>
          <div className="space-y-2">
            {todaysCheckIns.length > 0 ? (
                todaysCheckIns.map(booking => <ActivityItem key={booking.id} booking={booking} type="check-in" />)
            ) : (
                <p className="text-sm text-gray-500 text-center py-8">No check-ins scheduled for today.</p>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Check-outs</h2>
           <div className="space-y-2">
            {todaysCheckOuts.length > 0 ? (
                todaysCheckOuts.map(booking => <ActivityItem key={booking.id} booking={booking} type="check-out" />)
            ) : (
                <p className="text-sm text-gray-500 text-center py-8">No check-outs scheduled for today.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};