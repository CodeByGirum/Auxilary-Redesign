import React, { useState } from 'react';
import { X, Globe, User, Mic, Database, HardDrive, Shield, Smartphone } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState('Data controls');

  if (!isOpen) return null;

  const menuItems = [
    { icon: Globe, label: 'General' },
    { icon: User, label: 'Personalization' },
    { icon: Mic, label: 'Speech' },
    { icon: Database, label: 'Data controls' },
    { icon: HardDrive, label: 'Builder profile' },
    { icon: Smartphone, label: 'Connected apps' },
    { icon: Shield, label: 'Security' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white dark:bg-[#1f1f1f] w-full max-w-[800px] min-h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2f2f2f]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] dark:text-gray-400 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-1 flex-col md:flex-row h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-r border-gray-100 dark:border-[#2f2f2f] p-4 overflow-y-auto bg-gray-50/50 dark:bg-[#1f1f1f]">
             <nav className="space-y-1">
               {menuItems.map((item) => (
                 <button
                   key={item.label}
                   onClick={() => setActiveTab(item.label)}
                   className={`
                     w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                     ${activeTab === item.label 
                       ? 'bg-gray-100 dark:bg-[#2f2f2f] text-gray-900 dark:text-white' 
                       : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-[#2f2f2f]/50'}
                   `}
                 >
                   <item.icon size={18} strokeWidth={1.5} />
                   {item.label}
                 </button>
               ))}
             </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white dark:bg-[#1f1f1f]">
            {activeTab === 'Data controls' && (
              <div className="space-y-8">
                {/* Improve model */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-[#2f2f2f]">
                   <span className="text-sm text-gray-900 dark:text-white font-medium">Improve the model for everyone</span>
                   <div className="flex items-center gap-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                      <span>On</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                   </div>
                </div>

                {/* Shared Links */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-[#2f2f2f]">
                   <span className="text-sm text-gray-900 dark:text-white font-medium">Shared links</span>
                   <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-[#444] text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2f2f2f] transition-colors">
                      Manage
                   </button>
                </div>

                {/* Export Data */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-[#2f2f2f]">
                   <span className="text-sm text-gray-900 dark:text-white font-medium">Export data</span>
                   <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-[#444] text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2f2f2f] transition-colors">
                      Export
                   </button>
                </div>

                {/* Delete Account */}
                <div className="flex items-center justify-between pt-2">
                   <span className="text-sm text-gray-900 dark:text-white font-medium">Delete account</span>
                   <button className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors shadow-sm">
                      Delete
                   </button>
                </div>
              </div>
            )}
            
            {activeTab !== 'Data controls' && (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                 <div className="p-4 bg-gray-100 dark:bg-[#2f2f2f] rounded-full mb-4">
                    {menuItems.find(m => m.label === activeTab)?.icon && React.createElement(menuItems.find(m => m.label === activeTab)!.icon, { size: 32, strokeWidth: 1.5 })}
                 </div>
                 <p className="text-gray-500">Settings for {activeTab} are under construction.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};