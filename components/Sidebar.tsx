import React from 'react';
import { HotelIcon } from './icons/HotelIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { ListDetailsIcon } from './icons/ListDetailsIcon';
import { CalendarPlusIcon } from './icons/CalendarPlusIcon';
import { DoorIcon } from './icons/DoorIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { XIcon } from './icons/XIcon';

// FIX: Extracted NavItem props to a dedicated type to resolve TS errors related to the `key` prop.
type NavItemProps = {
    // FIX: Specify that the icon prop is a React element that accepts a className, resolving cloneElement type errors.
    icon: React.ReactElement<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
};
// FIX: Explicitly typing the NavItem as a React.FC to correctly handle the `key` prop and resolve TypeScript errors.
const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
    <li>
        <a 
            href="#" 
            onClick={onClick}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {React.cloneElement(icon, { className: 'h-6 w-6' })}
            <span className="font-semibold">{label}</span>
        </a>
    </li>
);


export const Sidebar = ({ activeView, setActiveView, onSwitchRole, isOpen, setIsOpen }) => {
  // FIX: Added className prop to satisfy icon component prop requirements.
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="" /> },
    { id: 'bookings', label: 'Bookings', icon: <ListDetailsIcon className="" /> },
    { id: 'new_booking', label: 'New Booking', icon: <CalendarPlusIcon className="" /> },
    { id: 'rooms', label: 'Rooms', icon: <DoorIcon className="" /> },
  ];
  
  const handleNavClick = (view) => {
      setActiveView(view);
      if (window.innerWidth < 768) { // md breakpoint
          setIsOpen(false);
      }
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`fixed md:relative z-40 flex flex-col w-64 h-full bg-white border-r border-gray-200 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center gap-4 p-6 border-b border-gray-200">
            <HotelIcon className="h-10 w-10 text-blue-600" />
            <div>
                <h1 className="text-xl font-bold text-gray-800">Hotel Admin</h1>
                <p className="text-xs text-gray-500">Management Panel</p>
            </div>
        </div>
        
        <nav className="flex-1 px-4 py-6">
            <ul className="space-y-3">
               {navItems.map(item => (
                   <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeView === item.id}
                        onClick={() => handleNavClick(item.id)}
                   />
               ))}
            </ul>
        </nav>
      </aside>
    </>
  );
};
