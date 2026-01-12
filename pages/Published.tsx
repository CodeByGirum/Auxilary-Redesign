import React, { useState } from 'react';
import { Search, Heart, Eye, ArrowUpRight, TrendingUp } from 'lucide-react';
import { PUBLISHED_NOTEBOOKS } from '../constants';

// --- Shared Internal Component: EditorialNotebookCard ---
const EditorialNotebookCard: React.FC<{ notebook: typeof PUBLISHED_NOTEBOOKS[0] }> = ({ notebook }) => {
  return (
    <div className="group flex flex-col md:flex-row gap-8 p-8 bg-white dark:bg-[#1f1f1f] rounded-[32px] border border-gray-100 dark:border-[#333] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none overflow-hidden">
      
      {/* Thumbnail / Graphic */}
      <div className={`w-full md:w-72 aspect-[4/3] rounded-[24px] ${notebook.gradient} relative overflow-hidden flex-shrink-0 shadow-sm`}>
          <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center translate-y-3">
              <div className="w-28 h-36 bg-white rounded-xl shadow-2xl transform group-hover:scale-105 group-hover:-translate-y-2 group-hover:rotate-1 transition-transform duration-500 origin-bottom flex flex-col p-5 gap-3">
                  <div className="w-14 h-2 bg-gray-100 rounded-full" />
                  <div className="space-y-2 flex-1 opacity-50">
                      <div className="w-full h-px bg-gray-100" />
                      <div className="w-full h-1.5 bg-gray-50 rounded-full" />
                      <div className="w-5/6 h-1.5 bg-gray-50 rounded-full" />
                      <div className="w-full h-1.5 bg-gray-50 rounded-full" />
                  </div>
                  <div className="mt-auto flex gap-1.5 opacity-30">
                      <div className="w-5 h-5 bg-gray-100 rounded" />
                  </div>
              </div>
          </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col py-1">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest">
                    {notebook.category}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">
                    {notebook.date}
                </span>
            </div>
        </div>

        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight tracking-tighter">
            {notebook.title}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed mb-8 line-clamp-3 max-w-2xl">
            {notebook.description}
        </p>

        {/* Footer of the Card */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50 dark:border-[#2a2a2a]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#333] overflow-hidden">
                   <img 
                      src={`https://ui-avatars.com/api/?name=${notebook.author}&background=random`} 
                      className="w-full h-full object-cover" 
                      alt={notebook.author}
                   />
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                    {notebook.author}
                </span>
            </div>

            <div className="flex items-center gap-5 text-gray-400">
                <div className="flex items-center gap-2 text-[10px] font-bold font-mono">
                    <Heart size={14} className="group-hover:text-pink-500 transition-colors" strokeWidth={2.5} />
                    <span>{notebook.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold font-mono">
                    <Eye size={14} strokeWidth={2.5} />
                    <span>{notebook.reads}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export const Published = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = ['All', 'Advertising', 'Social', 'CRM', 'Search', 'Research', 'Growth'];
  
  const filteredNotebooks = PUBLISHED_NOTEBOOKS.filter(nb => {
    const matchesSearch = nb.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          nb.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || nb.category === selectedTag;
    return matchesSearch && matchesTag;
  });

  const trendingItems = [...PUBLISHED_NOTEBOOKS].sort((a, b) => b.likes - a.likes).slice(0, 4);

  return (
    <div className="min-h-full bg-white dark:bg-[#212121] transition-colors duration-300">
      <div className="px-6 md:px-12 lg:px-16 py-12 max-w-[1500px] mx-auto">
        
        {/* Header - Aligned with Standard Page Design */}
        <div className="mb-16">
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">
                Discover notebooks
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed font-normal">
                Explore a registry of shared analytical findings, marketing audits, and strategic reports published by the community.
            </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pb-8 border-b border-gray-100 dark:border-[#2f2f2f]">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {tags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`
                            px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border
                            ${selectedTag === tag 
                                ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-xl' 
                                : 'bg-white dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-500 border-gray-100 dark:border-[#333] hover:border-gray-300 dark:hover:border-gray-600'
                            }
                        `}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="relative group w-full md:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search notebooks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] rounded-full text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-500 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all border border-gray-100 dark:border-[#333]"
                />
            </div>
        </div>

        {/* Main Grid: Feed + Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Primary Feed */}
            <div className="lg:col-span-8 space-y-10">
                {filteredNotebooks.length > 0 ? (
                    filteredNotebooks.map(nb => (
                        <EditorialNotebookCard key={nb.id} notebook={nb} />
                    ))
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center mb-6">
                            <Search size={32} className="opacity-20" />
                        </div>
                        <p className="text-lg font-bold tracking-tight text-gray-500">No results found for "{searchQuery}"</p>
                        <button onClick={() => setSearchQuery('')} className="mt-4 text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">Clear Search</button>
                    </div>
                )}
            </div>

            {/* Sidebar: Weekly Highlights / Trending */}
            <div className="lg:col-span-4 space-y-12">
                
                {/* Trending Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trending Now</h3>
                        <TrendingUp size={16} className="text-gray-300" />
                    </div>
                    <div className="space-y-8">
                        {trendingItems.map((item, idx) => (
                            <div key={item.id} className="group flex gap-5 cursor-pointer">
                                <span className="text-4xl font-black text-gray-100 dark:text-[#2a2a2a] group-hover:text-indigo-500/30 transition-colors pt-0 font-mono">
                                    {idx + 1}
                                </span>
                                <div className="min-w-0 pt-1">
                                    <h4 className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5 line-clamp-1 leading-tight tracking-tight">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        <span>{item.author}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1.5 font-mono"><Eye size={12} strokeWidth={2.5} /> {item.reads}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-[#2f2f2f]"></div>

                {/* Topics / Tags Cloud */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Popular Topics</h3>
                    <div className="flex flex-wrap gap-2.5">
                        {['Big Data', 'Retention', 'Generative AI', 'ROI', 'Marketing Ops', 'Cloud', 'Ethics'].map(topic => (
                            <button 
                                key={topic}
                                className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#333] rounded-xl text-[11px] text-gray-600 dark:text-gray-400 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-bold uppercase tracking-wider"
                            >
                                #{topic}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Promotional / Institutional Card */}
                <div className="p-10 bg-black dark:bg-white rounded-[40px] text-white dark:text-black relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-16 bg-white/10 dark:bg-black/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                    <h3 className="text-2xl font-black mb-4 relative z-10 tracking-tighter">Contribute to the Library</h3>
                    <p className="text-sm opacity-70 mb-8 relative z-10 leading-relaxed font-medium">
                        Share your findings with the community. Published notebooks earn reach and reputation in the registry.
                    </p>
                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-2xl hover:scale-105 active:scale-95 transition-all relative z-10 shadow-lg shadow-black/20 dark:shadow-white/10">
                        Learn More <ArrowUpRight size={16} strokeWidth={3} />
                    </button>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
