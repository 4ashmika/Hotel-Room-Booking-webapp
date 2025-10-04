import React from 'react';
import { HotelIcon } from './icons/HotelIcon';
import { HomeIcon } from './icons/HomeIcon';
import { CalendarPlusIcon } from './icons/CalendarPlusIcon';
import { SearchIcon } from './icons/SearchIcon';

type NavItemProps = {
    icon: React.ReactElement<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
    <li>
        <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onClick(); }}
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

type GuestSidebarProps = {
  activeView: string;
  setActiveView: (view: 'welcome' | 'new_booking' | 'find_booking') => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const GuestSidebar: React.FC<GuestSidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
  // FIX: Added className prop to icon components to satisfy prop requirements.
  const navItems = [
    { id: 'welcome', label: 'Welcome', icon: <HomeIcon className="" /> },
    { id: 'new_booking', label: 'New Booking', icon: <CalendarPlusIcon className="" /> },
    { id: 'find_booking', label: 'Find My Booking', icon: <SearchIcon className="" /> },
  ];
  
  const handleNavClick = (view: 'welcome' | 'new_booking' | 'find_booking') => {
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
                <h1 className="text-xl font-bold text-gray-800">Hotel Guest</h1>
                <p className="text-xs text-gray-500">Welcome Portal</p>
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
                        onClick={() => handleNavClick(item.id as 'welcome' | 'new_booking' | 'find_booking')}
                   />
               ))}
            </ul>
        </nav>
      </aside>
    </>
  );
};