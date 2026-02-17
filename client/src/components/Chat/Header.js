import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon, 
  Cog6ToothIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';

const Header = ({ currentRoom, onToggleSidebar, sidebarOpen }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sidebarOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Room Info */}
        {currentRoom ? (
          <div className="ml-4">
            <h1 className="text-lg font-semibold text-gray-900">{currentRoom.name}</h1>
            <p className="text-sm text-gray-500">
              {currentRoom.members?.length || 0} members
            </p>
          </div>
        ) : (
          <div className="ml-4">
            <h1 className="text-lg font-semibold text-gray-900">Multilingual Chat</h1>
            <p className="text-sm text-gray-500">Select a room to start chatting</p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Translation Interface Link */}
        <Link
          to="/translate"
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Translation Interface"
        >
          <LanguageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Translate</span>
        </Link>

        {/* Settings Button */}
        <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Cog6ToothIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Header;
