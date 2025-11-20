import React from 'react';
import { Globe, Copy, ExternalLink } from 'lucide-react';

export const Published = () => {
  return (
    <div className="px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Published</h2>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
           <div key={i} className="p-5 bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-[#333] rounded-xl">
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                    <Globe size={16} className="text-indigo-500" />
                    <h3 className="font-medium text-gray-900 dark:text-white">Public Report {i}</h3>
                 </div>
                 <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold rounded uppercase">Live</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                 Accessible via public link. Last updated 2 days ago.
              </p>
              
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#212121] p-2 rounded-lg border border-gray-100 dark:border-[#333]">
                 <span className="text-xs text-gray-400 truncate flex-1 font-mono">https://auxiliary.ai/share/k92...</span>
                 <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#444] rounded text-gray-500 transition-colors">
                    <Copy size={14} />
                 </button>
                 <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#444] rounded text-gray-500 transition-colors">
                    <ExternalLink size={14} />
                 </button>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};