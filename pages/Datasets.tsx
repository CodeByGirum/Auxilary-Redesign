import React from 'react';
import { Database, Download, MoreHorizontal, FileText } from 'lucide-react';

export const Datasets = () => {
  const datasets = [
    { id: 1, name: 'Customer Churn Data', format: 'CSV', size: '2.4 GB', updated: '2h ago' },
    { id: 2, name: 'Image Net Subset', format: 'Folder', size: '15.6 GB', updated: '1d ago' },
    { id: 3, name: 'Sentiment Analysis', format: 'JSON', size: '450 MB', updated: '3d ago' },
    { id: 4, name: 'Global Market Trends', format: 'SQL', size: '1.1 GB', updated: '1w ago' },
  ];

  return (
    <div className="px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Datasets</h2>
      </div>

      <div className="space-y-2">
        {datasets.map((ds) => (
          <div key={ds.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer group">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 dark:bg-[#212121] rounded-lg text-gray-500 dark:text-gray-400">
                    {ds.format === 'CSV' ? <FileText size={20} strokeWidth={1.5} /> : <Database size={20} strokeWidth={1.5} />}
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{ds.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ds.format} • {ds.size}</p>
                </div>
             </div>
             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-400 mr-2">{ds.updated}</span>
                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-[#444]">
                    <Download size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-[#444]">
                    <MoreHorizontal size={16} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};