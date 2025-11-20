import React from 'react';
import { NOTIFICATIONS, ACTIVITIES } from '../constants';
import { X } from 'lucide-react';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightPanel = ({ isOpen, onClose }: RightPanelProps) => {
  return (
    <div 
      className={`
        fixed top-0 right-0 h-screen w-[320px] bg-[#F9F9F9] dark:bg-[#171717] 
        border-l border-gray-200 dark:border-[#333] z-50 
        transform transition-transform duration-300 ease-out shadow-xl
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      onMouseLeave={onClose}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-8">
            <h3 className="font-medium text-base text-gray-900 dark:text-white">Notifications</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <X size={18} />
            </button>
        </div>
      
        {/* Notifications List */}
        <div className="space-y-6">
          <div>
             <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Recent</h4>
             <div className="space-y-4">
                {NOTIFICATIONS.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                        <img src={item.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                         <span className="font-semibold">{item.user}</span> {item.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="w-full h-px bg-gray-200 dark:bg-[#333]"></div>

          <div>
             <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Activity</h4>
             <div className="space-y-4">
                {ACTIVITIES.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start p-2 -mx-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                      <img src={item.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                         <span className="font-semibold text-gray-900 dark:text-white">{item.user}</span> {item.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};