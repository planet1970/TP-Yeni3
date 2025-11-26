import React from 'react';
import { SearchIcon, MoonIcon, BellIcon, CogIcon, ClockIcon, MenuIcon } from './icons';

interface HeaderProps {
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white p-4 flex justify-between items-center shadow-sm print:hidden">
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button onClick={onToggleSidebar} className="mr-4 text-gray-600 hover:text-gray-900 lg:hidden">
            <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-700 hidden sm:block">HOŞ GELDİNİZ!</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative hidden sm:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Ara..."
            className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-64"
          />
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoonIcon className="h-6 w-6" />
        </button>
        <button className="relative text-gray-500 hover:text-gray-700">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
        </button>
        <button className="text-gray-500 hover:text-gray-700 hidden sm:block">
          <CogIcon className="h-6 w-6" />
        </button>
        <button className="text-gray-500 hover:text-gray-700 hidden sm:block">
            <ClockIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <img
            className="h-9 w-9 rounded-full"
            src="https://picsum.photos/100"
            alt="User avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;