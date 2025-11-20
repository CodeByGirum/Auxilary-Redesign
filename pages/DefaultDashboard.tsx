import React from 'react';
import { Folder, DollarSign, Users } from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';

// Helper Components specific to this page
const StatCard = ({ title, value, change, positive, icon: Icon, bgColor, darkBgColor }: any) => (
  <div className={`${bgColor} ${darkBgColor} p-6 rounded-2xl flex flex-col justify-between h-32 min-w-[200px] transition-colors`}>
    <div className="flex justify-between items-start">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</span>
      <Icon size={20} className="text-gray-700 dark:text-gray-300 opacity-70" />
    </div>
    <div className="flex justify-between items-end">
      <span className="text-3xl font-semibold text-gray-900 dark:text-white">{value}</span>
      <span className={`text-xs font-medium ${positive ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'} flex items-center gap-1`}>
        {positive ? '+' : ''}{change} 
        {positive 
          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6"/></svg>
          : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
        }
      </span>
    </div>
  </div>
);

const ProjectCard: React.FC<{ project: typeof MOCK_PROJECTS[0] }> = ({ project }) => {
  const { name, dueDate, status, totalTasks, completedTasks, members, icon: Icon, iconColor } = project;
  
  const progress = Math.round((completedTasks / totalTasks) * 100);
  
  let statusColor = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  if (status === 'In Progress') statusColor = 'text-purple-600 dark:text-purple-400';
  if (status === 'Complete') statusColor = 'text-green-500 dark:text-green-400';
  if (status === 'Rejected') statusColor = 'text-gray-500 dark:text-gray-500';
  if (status === 'Pending') statusColor = 'text-blue-400 dark:text-blue-400';
  if (status === 'Approved') statusColor = 'text-yellow-500 dark:text-yellow-400';

  return (
    <div className="bg-white dark:bg-[#18181b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
            <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
            <p className="text-xs text-gray-400 mt-1">Due Date: {dueDate}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconColor}`}>
            <Icon size={20} />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex -space-x-2">
            {members.map((m, i) => (
                <img key={i} src={m} alt="member" className="w-6 h-6 rounded-full border-2 border-white dark:border-[#18181b]" />
            ))}
        </div>
        <span className={`text-xs font-medium flex items-center gap-1 ${statusColor}`}>
            {status === 'In Progress' && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>}
            {status === 'Complete' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></span>}
            {status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-400"></span>}
            {status === 'Approved' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 dark:bg-yellow-400"></span>}
            {status === 'Rejected' && <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>}
            {status}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{completedTasks} / {totalTasks} Total Tasks</span>
            <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full ${status === 'Complete' ? 'bg-green-500' : 'bg-purple-500'}`} 
                style={{ width: `${progress}%` }}
            />
        </div>
      </div>
    </div>
  );
};

export const DefaultDashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">My Projects</h2>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Current Projects" 
          value="268" 
          change="11.01%" 
          positive={true} 
          icon={Folder} 
          bgColor="bg-blue-50"
          darkBgColor="dark:bg-blue-900/20" 
        />
        <StatCard 
          title="Project Finance" 
          value="$3,290" 
          change="0.03%" 
          positive={false} 
          icon={DollarSign} 
          bgColor="bg-gray-100"
          darkBgColor="dark:bg-white/5" 
        />
        <StatCard 
          title="Our Clients" 
          value="31" 
          change="15.03%" 
          positive={true} 
          icon={Users} 
          bgColor="bg-blue-50"
          darkBgColor="dark:bg-blue-900/20" 
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
