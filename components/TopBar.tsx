
import React from 'react';
import { Sun, Moon, Bell, Share2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  onNotificationClick: () => void;
}

export const TopBar = ({ onNotificationClick }: TopBarProps) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'New Chat';
    if (path === '/search') return 'Search';
    return path.substring(1).charAt(0).toUpperCase() + path.slice(2);
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-30 bg-white/80 dark:bg-[#212121]/80 backdrop-blur-sm">
      {/* Left / Title Area */}
      <div className="flex items-center gap-2 px-3 py-1.5 mx-auto md:mx-0">
        <h1 className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-tight">
          {getTitle()}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] dark:text-gray-400 rounded-md transition-colors">
          <Share2 size={18} strokeWidth={1.5} />
        </button>
        
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] dark:text-gray-400 rounded-md transition-colors"
        >
            {theme === 'light' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
        </button>

        <button 
          onClick={onNotificationClick}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] dark:text-gray-400 rounded-md transition-colors relative"
        >
            <Bell size={18} strokeWidth={1.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#212121]"></span>
        </button>
      </div>
    </header>
  );
};
