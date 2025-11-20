import React from 'react';
import { Search, ArrowRight, Clock, TrendingUp } from 'lucide-react';

export const SearchPage = () => {
  return (
    <div className="px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-8">Search Workspace</h1>
        
        <div className="relative group mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-200 transition-colors" size={20} strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Search projects, data, or conversations..." 
            className="w-full bg-gray-50 dark:bg-[#2f2f2f] border border-transparent focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-base shadow-sm focus:shadow-md transition-all outline-none dark:text-white"
            autoFocus
          />
        </div>

        <div className="space-y-8">
            <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Recent</h3>
                <div className="space-y-1">
                    {['Q3 Financial Analysis', 'Customer Churn Model v2', 'Deployment Logs'].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f] cursor-pointer text-gray-700 dark:text-gray-300 transition-colors">
                            <Clock size={16} className="text-gray-400" />
                            <span className="text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Trending</h3>
                <div className="space-y-1">
                    {['Generative AI Policy', 'Sales Dashboard 2024'].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f] cursor-pointer text-gray-700 dark:text-gray-300 transition-colors">
                            <TrendingUp size={16} className="text-gray-400" />
                            <span className="text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};