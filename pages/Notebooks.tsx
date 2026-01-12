
import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, FileText, PieChart, BarChart3, LineChart, Sparkles } from 'lucide-react';
import { Notebook } from '../types';
import { CreateNotebookModal } from '../components/CreateNotebookModal';

// --- Color Palette Configuration ---
const GRADIENT_PALETTE = [
  { class: 'bg-gradient-to-br from-[#f472b6] to-[#db2777]', type: 'warm' }, // Pink
  { class: 'bg-gradient-to-br from-[#f87171] to-[#dc2626]', type: 'warm' }, // Red
  { class: 'bg-gradient-to-br from-[#fbbf24] to-[#d97706]', type: 'warm' }, // Amber
  { class: 'bg-gradient-to-br from-[#fb923c] to-[#ea580c]', type: 'warm' }, // Orange
  
  { class: 'bg-gradient-to-br from-[#60a5fa] to-[#2563eb]', type: 'cool' }, // Blue
  { class: 'bg-gradient-to-br from-[#22d3ee] to-[#0891b2]', type: 'cool' }, // Cyan
  { class: 'bg-gradient-to-br from-[#34d399] to-[#059669]', type: 'cool' }, // Emerald
  { class: 'bg-gradient-to-br from-[#2dd4bf] to-[#0d9488]', type: 'cool' }, // Teal
  
  { class: 'bg-gradient-to-br from-[#818cf8] to-[#4f46e5]', type: 'purple' }, // Indigo
  { class: 'bg-gradient-to-br from-[#a78bfa] to-[#7c3aed]', type: 'purple' }, // Violet
  { class: 'bg-gradient-to-br from-[#e879f9] to-[#c026d3]', type: 'purple' }, // Fuchsia
];

// How many recent cards we must NOT repeat
const RECENT_WINDOW = 6;

// Pick a gradient that is NOT in the recent window and ideally not the same type as last
const pickNextGradient = (recentGradients: string[]) => {
  const lastGradient = recentGradients[0];
  const lastObj = GRADIENT_PALETTE.find(g => g.class === lastGradient);

  // 1) hard block: do not reuse any of the last N gradients
  const blocked = new Set(recentGradients.slice(0, RECENT_WINDOW));

  let candidates = GRADIENT_PALETTE.filter(g => !blocked.has(g.class));

  // 2) soft block: prefer different "type" than the last one
  if (lastObj) {
    const diffType = candidates.filter(g => g.type !== lastObj.type);
    if (diffType.length > 0) candidates = diffType;
  }

  // 3) fallback: if palette is smaller than window, allow reuse but avoid exact last
  if (candidates.length === 0) {
    candidates = GRADIENT_PALETTE.filter(g => g.class !== lastGradient);
  }

  // Final fallback if everything failed (shouldn't happen with decent palette size)
  if (candidates.length === 0) return GRADIENT_PALETTE[0].class;

  return candidates[Math.floor(Math.random() * candidates.length)].class;
};

// --- Mock Data ---

const MOCK_NOTEBOOKS: Notebook[] = [
  { 
    id: '1', 
    title: 'Customer Churn Analysis', 
    description: 'Deep dive into Q3 churn factors and retention strategies.',
    author: 'Sarah Connor', 
    date: 'Oct 24, 2023',
    category: 'Analysis',
    gradient: 'bg-gradient-to-br from-[#f472b6] to-[#db2777]', // Pink
    icon: PieChart,
    environment: 'python',
    compute: 'cpu-std'
  },
  { 
    id: '2', 
    title: 'Q3 Financial Report', 
    description: 'Consolidated revenue streams and expense breakdown.',
    author: 'Elias K. Wren', 
    date: 'Nov 10, 2023',
    category: 'Finance',
    gradient: 'bg-gradient-to-br from-[#60a5fa] to-[#2563eb]', // Blue
    icon: BarChart3,
    environment: 'r',
    compute: 'cpu-pro'
  },
  { 
    id: '3', 
    title: 'User Behavior Study', 
    description: 'Session heatmap analysis and click-through rate study.',
    author: 'Frank Herbert', 
    date: 'Dec 05, 2023',
    category: 'Research',
    gradient: 'bg-gradient-to-br from-[#fbbf24] to-[#d97706]', // Amber
    icon: LineChart,
    environment: 'python',
    compute: 'gpu-t4'
  },
  { 
    id: '4', 
    title: 'Neural Networks 101', 
    description: 'Introductory guide to perceptrons and backpropagation.',
    author: 'Alan Turing', 
    date: 'Jan 12, 2024',
    category: 'Education',
    gradient: 'bg-gradient-to-br from-[#818cf8] to-[#4f46e5]', // Indigo
    icon: Sparkles,
    environment: 'python',
    compute: 'gpu-t4'
  },
  { 
    id: '5', 
    title: 'Product Roadmap 2024', 
    description: 'Timeline for upcoming features and major releases.',
    author: 'Product Team', 
    date: 'Feb 02, 2024',
    category: 'Strategy',
    gradient: 'bg-gradient-to-br from-[#34d399] to-[#059669]', // Emerald
    icon: FileText,
    environment: 'sql',
    compute: 'cpu-std'
  },
  { 
    id: '6', 
    title: 'Competitor Analysis', 
    description: 'Feature comparison against top 3 market competitors.',
    author: 'Marketing', 
    date: 'Feb 15, 2024',
    category: 'Marketing',
    gradient: 'bg-gradient-to-br from-[#f87171] to-[#dc2626]', // Red
    icon: BarChart3,
    environment: 'python',
    compute: 'cpu-std'
  },
];

// --- Components ---

const DocumentIllustration = ({ className }: { className?: string }) => (
  <div className={`relative w-28 h-36 bg-white rounded-xl shadow-2xl flex flex-col p-4 gap-3 transform transition-transform duration-500 ${className}`}>
     {/* Header Line */}
     <div className="w-12 h-1.5 bg-gray-100 rounded-full mb-1" />
     
     {/* Content Lines */}
     <div className="space-y-2 flex-1">
        <div className="w-full h-px bg-gray-100" />
        <div className="w-full h-1 bg-gray-50 rounded-full" />
        <div className="w-5/6 h-1 bg-gray-50 rounded-full" />
        <div className="w-full h-1 bg-gray-50 rounded-full" />
        <div className="w-4/5 h-1 bg-gray-50 rounded-full" />
     </div>

     {/* Footer Elements */}
     <div className="mt-auto flex gap-2 opacity-50">
        <div className="w-6 h-6 bg-gray-100 rounded-md" />
        <div className="w-6 h-6 bg-gray-100 rounded-md" />
     </div>
     
     {/* Fold Corner effect */}
     <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-gray-200 to-white rounded-bl-lg opacity-50" />
  </div>
);

const NotebookCard: React.FC<{ notebook: Notebook; onClick: (nb: Notebook) => void }> = ({ notebook, onClick }) => {
  return (
    <div 
        onClick={() => onClick(notebook)}
        className="group relative w-full aspect-[3.8/5] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 select-none bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-[#333]"
    >
      
      {/* 1. Gradient Header */}
      <div className={`h-[55%] ${notebook.gradient} relative overflow-hidden transition-colors duration-500`}>
         {/* Subtle noise/pattern overlay could go here */}
         <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
         
         {/* 2. Floating Document Illustration */}
         <div className="absolute inset-0 flex items-center justify-center translate-y-4 perspective-1000">
            <DocumentIllustration 
               className="group-hover:scale-105 group-hover:-translate-y-2 group-hover:rotate-1 origin-bottom shadow-xl ring-1 ring-black/5" 
            />
         </div>
      </div>

      {/* 3. Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-white dark:bg-[#1e1e1e] p-6 flex flex-col justify-between z-10">
         
         {/* Top Row: Date & Menu */}
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {notebook.date}
                </span>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); /* Handle Menu */ }}
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors p-1 -mr-2 -mt-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#333]"
            >
               <MoreHorizontal size={18} />
            </button>
         </div>

         {/* Middle: Title & Desc */}
         <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 line-clamp-1">
                {notebook.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                {notebook.description}
            </p>
         </div>

         {/* Bottom: Tags/Category */}
         <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-[#2a2a2a] text-[10px] font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#333]">
                {notebook.category}
            </span>
            {notebook.icon && (
                 <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                     <notebook.icon size={14} />
                 </div>
            )}
         </div>
      </div>
    </div>
  );
};

interface NotebooksProps {
    onOpenNotebook?: (notebook: Notebook) => void;
}

export const Notebooks: React.FC<NotebooksProps> = ({ onOpenNotebook }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notebooks, setNotebooks] = useState<Notebook[]>(MOCK_NOTEBOOKS);
  
  const filteredNotebooks = notebooks.filter(nb => 
    nb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nb.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
      setIsCreateModalOpen(true);
  };

  const handleModalCreate = (newNotebook: Notebook) => {
      // Logic to assign distinct, colorful gradient
      const recentGradients = notebooks.map(n => n.gradient).filter(Boolean) as string[];
      const assignedGradient = pickNextGradient(recentGradients);
      const notebookWithGradient = { ...newNotebook, gradient: assignedGradient };
      
      setNotebooks([notebookWithGradient, ...notebooks]);
      setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-full bg-white dark:bg-[#212121] transition-colors duration-300">
        <div className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto">
        
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">Notebooks</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">
                        Explore your data analysis, reports, and research documents.
                    </p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search notebooks..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-[#2f2f2f] rounded-full text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all"
                        />
                    </div>

                    {/* New Notebook Button */}
                    <button 
                        onClick={handleCreateNew}
                        className="flex items-center justify-center gap-2 pl-4 pr-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus size={18} />
                        <span>New Notebook</span>
                    </button>
                </div>
            </div>

            {/* Grid */}
            {filteredNotebooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {/* Add New Placeholder - Always First */}
                    <div 
                        onClick={handleCreateNew}
                        className="group relative w-full aspect-[3.8/5] rounded-[32px] border-2 border-dashed border-gray-200 dark:border-[#333] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#333] flex items-center justify-center text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors mb-4">
                            <Plus size={32} strokeWidth={1.5} />
                        </div>
                        <p className="font-medium text-gray-500 dark:text-gray-400">Create New Notebook</p>
                    </div>

                    {filteredNotebooks.map((nb) => (
                        <NotebookCard 
                            key={nb.id} 
                            notebook={nb} 
                            onClick={(n) => onOpenNotebook && onOpenNotebook(n)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-[#2f2f2f] rounded-full flex items-center justify-center mb-4">
                        <Search size={24} className="opacity-40" />
                    </div>
                    <p>No notebooks found matching "{searchQuery}"</p>
                    <button onClick={() => setSearchQuery('')} className="mt-2 text-sm text-blue-600 hover:underline">Clear search</button>
                </div>
            )}
        </div>

        <CreateNotebookModal 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleModalCreate}
        />
    </div>
  );
};
