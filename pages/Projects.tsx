import React from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { Plus, Filter, ArrowUpRight } from 'lucide-react';

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  // Generate random gradients or use real images if available
  const gradients = [
    'bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20',
    'bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20',
    'bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20',
    'bg-gradient-to-br from-rose-100 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/20',
  ];
  const bgStyle = gradients[index % gradients.length];

  return (
    <div className="group relative flex flex-col bg-white dark:bg-[#1f1f1f] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-[#333] cursor-pointer">
      {/* Image Section */}
      <div className={`h-48 w-full ${bgStyle} relative overflow-hidden`}>
        <img 
          src={`https://picsum.photos/600/400?random=${project.id}`} 
          alt={project.name}
          className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors"></div>
        
        <div className="absolute top-4 right-4">
           <button className="w-8 h-8 bg-white/90 dark:bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              <ArrowUpRight size={16} strokeWidth={1.5} />
           </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
             {/* Optional overlaid text if needed */}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                   {project.status}
                </p>
            </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50 dark:border-[#2f2f2f]">
             <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Deadline</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">{project.dueDate}</span>
             </div>

             <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((m, i) => (
                    <img 
                        key={i} 
                        src={m} 
                        alt="Member" 
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1f1f1f] object-cover"
                    />
                ))}
                {project.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1f1f1f] bg-gray-100 dark:bg-[#333] flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400">
                        +{project.members.length - 3}
                    </div>
                )}
             </div>
        </div>
        
        <button className="mt-5 w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg translate-y-2 group-hover:translate-y-0 duration-200">
           View Project
        </button>
      </div>
    </div>
  );
};

export const Projects = () => {
  return (
    <div className="px-6 py-10 pb-20 w-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Projects</h1>
           <p className="text-gray-500 dark:text-gray-400">Manage your ongoing work and deployments.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#333] rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2f2f2f] transition-colors text-gray-700 dark:text-gray-200">
                <Filter size={16} strokeWidth={1.5} />
                <span>Filter</span>
           </button>
           <button className="flex items-center gap-2 px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
                <Plus size={16} strokeWidth={1.5} />
                <span>New Project</span>
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
        ))}
      </div>
    </div>
  );
};