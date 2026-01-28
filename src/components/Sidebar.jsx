import React, { useState, } from 'react';

import { 
  Home, 
  Calendar, 
  Tag, 
  Compass, 
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Settings,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Navigation items
  const navItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'brands', name: 'Brands', icon: Tag },
    { id: 'tours', name: 'Tours', icon: Compass },
    { id: 'reminders', name: 'Reminders', icon: Bell },
  ];

  // Sample user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: 'January 15, 2024',
    status: 'Premium Member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle navigation click
  const handleNavClick = (itemId) => {
    setActiveItem(itemId);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out...');
    // Add your logout logic here
  };

  return (
    <aside className={`relative ${isDarkMode ? 'dark' : ''}`}>
      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:relative top-0 left-0 h-screen z-50
        transition-all duration-500 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'}
        bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black
        border-r border-gray-200 dark:border-gray-800
        shadow-xl
        flex flex-col
      `}>
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className={`flex items-center justify-between transition-all duration-300 ${isCollapsed ? 'flex-col space-y-4' : 'space-x-3'}`}>
            
            {/* Logo */}
            <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'flex-col' : 'space-x-3'}`}>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-300 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:rotate-12">
                  <div className="w-6 h-6 bg-white dark:bg-black rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-black dark:bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-300 dark:to-gray-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              
              {!isCollapsed && (
                <div className="transition-all duration-300 opacity-100">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    Tix PH
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Management Suite</p>
                </div>
              )}
            </div>

            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center 
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300
                       group transform hover:scale-105"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Navigation Section */}
          <nav className="p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      w-full flex items-center rounded-xl p-3 transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-300 text-white dark:text-black shadow-lg transform scale-[1.02]' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                      }
                      group relative overflow-hidden
                    `}
                  >
                    {/* Animated Background Effect */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                    )}
                    
                    {/* Icon */}
                    <div className={`
                      relative z-10 transition-all duration-300
                      ${isActive 
                        ? 'text-white dark:text-black transform scale-110' 
                        : 'group-hover:scale-110'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    {/* Label */}
                    {!isCollapsed && (
                      <span className={`
                        ml-3 font-medium transition-all duration-300 whitespace-nowrap
                        ${isActive ? 'text-white dark:text-black' : 'text-gray-600 dark:text-gray-400'}
                        group-hover:text-black dark:group-hover:text-white
                        relative z-10
                      `}>
                        {item.name}
                      </span>
                    )}

                    {/* Active Indicator */}
                    {isActive && !isCollapsed && (
                      <div className="absolute right-3 w-2 h-2 bg-white dark:bg-black rounded-full"></div>
                    )}

                    {/* Hover Indicator */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200 dark:border-gray-800"></div>

            {/* Settings Section */}
            <div className="space-y-1">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 
                         transition-all duration-300 group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                <div className="relative transition-transform duration-300 group-hover:scale-110">
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </div>
                {!isCollapsed && (
                  <span className="ml-3 font-medium transition-all duration-300 whitespace-nowrap">
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                )}
              </button>

              <button className="w-full flex items-center rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 
                                transition-all duration-300 group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                <Settings className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium transition-all duration-300 whitespace-nowrap">Settings</span>
                )}
              </button>

              <button className="w-full flex items-center rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 
                                transition-all duration-300 group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                <HelpCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium transition-all duration-300 whitespace-nowrap">Help & Support</span>
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Footer - User Details - Fixed at bottom */}
        <div className={`
          border-t border-gray-200 dark:border-gray-800 
          transition-all duration-500 ease-in-out
          ${isCollapsed ? 'h-20' : 'h-auto'}
          flex-shrink-0
        `}>
          {/* User Info Toggle */}
          <button
            onClick={() => setShowUserDetails(!showUserDetails)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 
                     transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-gray-800 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              
              {/* User Info - Only shows when sidebar is expanded */}
              {!isCollapsed && (
                <div className="text-left transition-all duration-300">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{user.status}</p>
                </div>
              )}
            </div>

            {/* Expand/Collapse Icon - Only shows when sidebar is expanded */}
            {!isCollapsed && (
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showUserDetails ? 'rotate-90' : ''}`} />
            )}
          </button>

          {/* Expanded User Details */}
          {!isCollapsed && showUserDetails && (
            <div className="px-4 pb-4 space-y-3 animate-fadeIn">
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 shadow-sm">
                {/* User Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Email</span>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white truncate">{user.email}</div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Phone</span>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white truncate">{user.phone}</div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Location</span>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white truncate">{user.location}</div>
                  
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Joined</span>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white truncate">{user.joinDate}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 py-2 bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-300 
                                   text-white dark:text-black text-xs font-medium rounded-lg 
                                   hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]">
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed User Avatar - Only shows when sidebar is collapsed */}
          {isCollapsed && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border-2 border-white dark:border-gray-800"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300"
              >
                <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed bottom-4 left-4 lg:hidden z-40 w-12 h-12 bg-gradient-to-br from-black to-gray-800 
                 text-white rounded-full flex items-center justify-center shadow-lg
                 hover:shadow-xl transform hover:scale-110 transition-all duration-300"
      >
        {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;