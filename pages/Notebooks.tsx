import React from 'react';
import { Play, Clock, MoreHorizontal, BookOpen } from 'lucide-react';

const NotebookCard = ({ title, author, progress, coverColor, lastRead }: any) => {
    return (
        <div className="group bg-white dark:bg-[#1f1f1f] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative flex flex-col h-[420px]">
            {/* Cover Image Area */}
            <div className={`h-[60%] ${coverColor} relative p-6 flex flex-col justify-between text-white`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                   <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium border border-white/10">
                      Analysis
                   </span>
                   <button className="p-2 bg-black/20 hover:bg-black/40 backdrop-blur rounded-full transition-colors">
                      <MoreHorizontal size={16} className="text-white" />
                   </button>
                </div>

                <div className="relative z-10">
                    <h3 className="text-2xl font-bold leading-tight mb-1 text-shadow-sm">{title}</h3>
                    <p className="text-sm text-white/80 font-medium">by {author}</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                   <div className="flex justify-between items-end text-sm">
                      <span className="font-semibold text-gray-900 dark:text-white">{progress}% Complete</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{lastRead}</span>
                   </div>
                   
                   {/* Progress Bar */}
                   <div className="h-1.5 w-full bg-gray-100 dark:bg-[#333] rounded-full overflow-hidden">
                      <div className="h-full bg-black dark:bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                   </div>

                   <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
                      <div className="flex items-center gap-1.5">
                         <Clock size={14} strokeWidth={1.5} />
                         <span>25 min avg</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <BookOpen size={14} strokeWidth={1.5} />
                         <span>213 pages</span>
                      </div>
                   </div>
                </div>

                <button className="w-full py-3 bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-white font-medium rounded-xl mt-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-2 group-hover:translate-y-0 translate-y-1">
                   <span>Resume Reading</span>
                   <Play size={14} fill="currentColor" />
                </button>
            </div>
        </div>
    );
}

export const Notebooks = () => {
  const notebooks = [
    { 
        title: "Dune Messiah Analysis", 
        author: "Frank Herbert Data", 
        progress: 62, 
        coverColor: "bg-gradient-to-b from-slate-600 to-slate-800",
        lastRead: "2 Days Ago"
    },
    { 
        title: "The Threshold of Ash", 
        author: "Elias K. Wren", 
        progress: 75, 
        coverColor: "bg-gradient-to-b from-orange-700 to-red-900",
        lastRead: "4 hours ago"
    },
    { 
        title: "Neural Networks 101", 
        author: "Sarah Connor", 
        progress: 12, 
        coverColor: "bg-gradient-to-b from-blue-600 to-indigo-900",
        lastRead: "Just now"
    },
  ];

  return (
    <div className="px-6 py-10 pb-20 w-full max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Notebooks</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {notebooks.map((nb, i) => (
            <NotebookCard key={i} {...nb} />
        ))}
        {/* Add Placeholder for "New" */}
        <div className="group border-2 border-dashed border-gray-200 dark:border-[#333] rounded-3xl flex flex-col items-center justify-center min-h-[420px] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer">
             <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors mb-4">
                 <Plus size={32} strokeWidth={1.5} />
             </div>
             <p className="font-medium text-gray-500 dark:text-gray-400">Create New Notebook</p>
        </div>
      </div>
    </div>
  );
};

// Helper component for New Notebook placeholder
import { Plus } from 'lucide-react';
