import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

const Header = ({ onToggleSidebar, isSidebarCollapsed }) => {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6 py-3">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="hidden lg:flex items-center space-x-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isSidebarCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Right side */}
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
        
        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            AJ
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Johnson</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Premium Member</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;