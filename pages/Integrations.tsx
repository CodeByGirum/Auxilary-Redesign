import React from 'react';
import { Puzzle, ExternalLink } from 'lucide-react';

export const Integrations = () => {
  return (
    <div className="px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Integrations</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Connect your workspace with external tools.</p>

        <div className="space-y-3">
          {['GitHub', 'Slack', 'AWS S3', 'HuggingFace', 'Jira'].map((tool, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-[#333] rounded-xl">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-[#212121] rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300">
                     <Puzzle size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{tool}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Sync data & notifications</p>
                  </div>
               </div>
               <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#383838] transition-colors text-gray-700 dark:text-gray-300">
                  Configure
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};