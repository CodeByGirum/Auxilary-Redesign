import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { Plus, Search, MoreHorizontal, File as FileIcon, Filter } from 'lucide-react';
import { CreateProjectModal } from '../components/CreateProjectModal';

// Visual component for the "Paper/Document" inside the folder
const DocumentIllustration = ({ className, style, delay = 0 }: { className?: string; style?: React.CSSProperties; delay?: number }) => (
  <div 
    className={`absolute w-32 h-40 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col p-4 gap-3 transition-transform duration-500 ${className}`} 
    style={style}
  >
     <div className="w-full h-2.5 bg-gray-100 rounded-full opacity-60" />
     <div className="w-3/4 h-2.5 bg-gray-100 rounded-full opacity-60" />
     <div className="w-full h-2.5 bg-gray-100 rounded-full opacity-60" />
     <div className="w-5/6 h-2.5 bg-gray-100 rounded-full opacity-60" />
     <div className="mt-auto flex gap-2">
        <div className="w-8 h-8 bg-gray-50 rounded-full" />
     </div>
  </div>
);

const FolderCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const gradients = [
    'bg-gradient-to-br from-[#60a5fa] to-[#2563eb]', // Blue
    'bg-gradient-to-br from-[#f472b6] to-[#db2777]', // Pink
    'bg-gradient-to-br from-[#fbbf24] to-[#d97706]', // Amber
    'bg-gradient-to-br from-[#34d399] to-[#059669]', // Emerald
    'bg-gradient-to-br from-[#818cf8] to-[#4f46e5]', // Indigo
  ];
  
  // Assign a consistent gradient based on index
  const bgGradient = gradients[index % gradients.length];
  
  // Generate formatting for file count
  const fileCount = project.totalTasks > 1000 
    ? `${(project.totalTasks / 1000).toFixed(1).replace('.0', '')}k` 
    : project.totalTasks;

  return (
    <div className="group relative w-full aspect-[4/4.5] md:aspect-square rounded-[32px] bg-white dark:bg-[#1e1e1e] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer select-none">
      
      {/* 1. Background Gradient Layer - Height limited to 70% to prevent bleed at bottom corners */}
      <div className={`absolute top-0 left-0 right-0 h-[70%] ${bgGradient} transition-opacity duration-500`}>
        {/* Optional: Add subtle noise or pattern here */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
      </div>

      {/* 2. Documents Layer (Sticking out) */}
      <div className="absolute top-[10%] left-0 right-0 h-[40%] flex justify-center items-end z-0 perspective-1000">
         {/* Document 1 (Left, rotated) */}
         <DocumentIllustration 
            className="origin-bottom-left transform -rotate-6 -translate-x-4 group-hover:-translate-y-2 group-hover:-rotate-12" 
            style={{ zIndex: 1, opacity: 0.8 }} 
         />
         {/* Document 2 (Right, rotated) */}
         <DocumentIllustration 
            className="origin-bottom-right transform rotate-6 translate-x-4 group-hover:-translate-y-2 group-hover:rotate-12" 
            style={{ zIndex: 2, opacity: 0.9 }} 
         />
         {/* Document 3 (Center) */}
         <DocumentIllustration 
            className="transform translate-y-2 group-hover:-translate-y-4 scale-105 shadow-md" 
            style={{ zIndex: 3 }} 
         />
      </div>

      {/* 3. Folder Front Panel (The "Pocket") */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] z-10">
        
        {/* The Tab Part */}
        <div className="absolute bottom-[calc(100%-1px)] left-0 w-[50%] h-[40px] bg-white dark:bg-[#1e1e1e] rounded-t-2xl transition-colors duration-300">
            {/* Content on Tab (if needed) */}
        </div>

        {/* The "Inverted Radius" Connector (Smooth curve between tab and body) */}
        <div 
            className="absolute left-[50%] bottom-[calc(100%-1px)] w-8 h-8 bg-transparent rounded-bl-2xl shadow-[-16px_16px_0_0_#ffffff] dark:shadow-[-16px_16px_0_0_#1e1e1e] pointer-events-none transition-colors duration-300"
        />

        {/* Main Body of Front Panel */}
        <div className="absolute inset-0 bg-white dark:bg-[#1e1e1e] rounded-tr-[32px] rounded-b-[32px] p-6 flex flex-col justify-between transition-colors duration-300">
            
            {/* Header Section inside Folder */}
            <div>
                <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {project.status === 'In Progress' ? 'Active' : project.status}
                    </span>
                    <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-gray-400 dark:text-gray-500">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                    {project.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {project.description || 'No description provided.'}
                </p>

                {/* Tags */}
                <div className="flex gap-2 mt-3 flex-wrap">
                    {project.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#2a2a2a] text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer Section inside Folder */}
            <div className="flex items-center justify-between mt-auto pt-4">
                <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((m, i) => (
                        <img 
                            key={i} 
                            src={m} 
                            alt="Member" 
                            className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1e1e1e] object-cover"
                        />
                    ))}
                    {project.members.length > 3 && (
                        <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1e1e1e] bg-gray-100 dark:bg-[#333] flex items-center justify-center text-[9px] font-bold text-gray-600 dark:text-gray-400">
                            +{project.members.length - 3}
                        </div>
                    )}
                </div>
            </div>
            
            {/* File Count Overlay (matches reference) */}
            <div className="absolute bottom-6 left-6 text-xs font-medium text-gray-400 hidden">
                {fileCount} Files
            </div>

        </div>
      </div>
    </div>
  );
};

export const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredProjects = projects.filter(p => {
     const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description?.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
     return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'In Progress', 'Complete', 'Pending'];

  const handleCreateProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-full bg-white dark:bg-[#212121] transition-colors duration-300">
        <div className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto">
        
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">Projects</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">
                        Manage your ongoing work, track progress, and organize your deliverables.
                    </p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search projects..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-[#2f2f2f] rounded-full text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all"
                        />
                    </div>

                    {/* New Project Button */}
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center justify-center gap-2 pl-4 pr-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus size={18} />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                {statuses.map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                            ${filterStatus === status 
                                ? 'bg-black dark:bg-white text-white dark:text-black' 
                                : 'bg-gray-100 dark:bg-[#2f2f2f] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#383838]'
                            }
                        `}
                    >
                        {status}
                    </button>
                ))}
                <div className="w-px h-6 bg-gray-200 dark:bg-[#333] mx-2"></div>
                <button className="p-2 rounded-full bg-gray-100 dark:bg-[#2f2f2f] text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                    <Filter size={16} />
                </button>
            </div>

            {/* Grid */}
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProjects.map((project, idx) => (
                        <FolderCard key={project.id} project={project} index={idx} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-[#2f2f2f] rounded-full flex items-center justify-center mb-4">
                        <Search size={24} className="opacity-40" />
                    </div>
                    <p>No projects found matching "{searchQuery}"</p>
                    <button onClick={() => { setSearchQuery(''); setFilterStatus('All'); }} className="mt-2 text-sm text-blue-600 hover:underline">Clear filters</button>
                </div>
            )}
        </div>

        <CreateProjectModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)} 
            onCreate={handleCreateProject}
        />
    </div>
  );
};