import React from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip 
} from 'recharts';
import { Folder, List, Users, Zap } from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';
import { useTheme } from '../context/ThemeContext';

// Reusable Stat Pill
const AnalyticsStat = ({ title, value, change, icon: Icon }: any) => (
  <div className="bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-2xl flex flex-col justify-between transition-colors">
    <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        <Icon size={18} className="text-gray-600 dark:text-gray-400" />
    </div>
    <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        {change && <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{change}</span>}
    </div>
  </div>
);

export const ProjectDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dynamic Chart Data/Colors based on theme
  const PIE_DATA = [
    { name: 'Completed', value: 67.6, color: isDark ? '#F3F4F6' : '#1C1C1C' }, // White/Black
    { name: 'In Progress', value: 26.4, color: isDark ? '#6366f1' : '#C7D2FE' }, // Indigo
    { name: 'Behind', value: 6.0, color: isDark ? '#818CF8' : '#818CF8' }, // Indigo
  ];

  const BAR_DATA = [
    { name: 'Jan', val: 20 },
    { name: 'Feb', val: 25 },
    { name: 'Mar', val: 28 },
    { name: 'Apr', val: 35 },
    { name: 'May', val: 22 },
    { name: 'Jun', val: 30 },
    { name: 'Jul', val: 24 },
    { name: 'Aug', val: 18, active: true }, // Highlighted
    { name: 'Sep', val: 26 },
    { name: 'Oct', val: 15 },
    { name: 'Nov', val: 24 },
    { name: 'Dec', val: 30 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Projects</h2>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsStat title="Total Projects" value="29" change="+11.01% ↗" icon={Folder} />
        <AnalyticsStat title="Total Tasks" value="715" change="-0.03% ↘" icon={List} />
        <AnalyticsStat title="Members" value="31" change="+15.03% ↗" icon={Users} />
        <AnalyticsStat title="Productivity" value="93.8%" change="+6.08% ↗" icon={Zap} />
      </div>

      {/* Middle Section: Pie Chart + Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Project Status Pie Chart */}
        <div className="bg-white dark:bg-[#18181b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Project Status</h3>
          
          <div className="h-48 relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={PIE_DATA}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={0}
                   dataKey="value"
                   startAngle={90}
                   endAngle={-270}
                   stroke="none"
                 >
                   {PIE_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             {/* Center text simulation */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Empty center for aesthetics */}
             </div>
          </div>

          <div className="mt-4 space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-100' : 'bg-black'}`}></span> Completed
                </span>
                <span className="font-medium text-gray-900 dark:text-white">67.6%</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-indigo-200'}`}></span> In Progress
                </span>
                <span className="font-medium text-gray-900 dark:text-white">26.4%</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Behind
                </span>
                <span className="font-medium text-gray-900 dark:text-white">6%</span>
             </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white dark:bg-[#18181b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 lg:col-span-2 flex flex-col transition-colors">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-semibold text-gray-900 dark:text-white">Tasks</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase font-medium border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="py-3 font-normal">Title</th>
                  <th className="py-3 font-normal">Assigned to</th>
                  <th className="py-3 font-normal">Time Spend</th>
                  <th className="py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {MOCK_PROJECTS.slice(0, 5).map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 font-medium text-gray-900 dark:text-white">{project.name}</td>
                    <td className="py-4">
                      <div className="flex -space-x-2">
                         {project.members.map((m, i) => (
                             <img key={i} src={m} className="w-6 h-6 rounded-full border border-white dark:border-[#18181b]" alt="" />
                         ))}
                      </div>
                    </td>
                    <td className="py-4 text-gray-500 dark:text-gray-400">{(Math.random() * 100).toFixed(0)}hr {(Math.random() * 60).toFixed(0)}min</td>
                    <td className="py-4">
                       <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit
                         ${project.status === 'Complete' ? 'text-green-600 dark:text-green-400' : 
                           project.status === 'In Progress' ? 'text-blue-600 dark:text-blue-400' : 
                           project.status === 'Approved' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}
                       `}>
                          <span className={`w-1.5 h-1.5 rounded-full 
                            ${project.status === 'Complete' ? 'bg-green-600 dark:bg-green-400' : 
                           project.status === 'In Progress' ? 'bg-blue-600 dark:bg-blue-400' : 
                           project.status === 'Approved' ? 'bg-yellow-600 dark:bg-yellow-400' : 'bg-gray-500 dark:bg-gray-400'}
                          `}></span>
                          {project.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tasks Overview Bar Chart */}
      <div className="bg-white dark:bg-[#18181b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Tasks Overview</h3>
            <div className="text-sm text-gray-400">Total: <span className="font-semibold text-gray-900 dark:text-white">20M</span></div>
         </div>

         <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={BAR_DATA} barSize={12}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#9CA3AF' }} 
                    dy={10}
                  />
                  <Tooltip 
                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: isDark ? '1px solid #374151' : 'none', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      backgroundColor: isDark ? '#1f2937' : '#fff',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                  <Bar dataKey="val" radius={[4, 4, 4, 4]}>
                    {BAR_DATA.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.active 
                            ? (isDark ? '#ffffff' : '#111827') 
                            : (isDark ? '#4338ca' : '#A5B4FC')
                        } 
                      />
                    ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
      
      <div className="mt-8 text-xs text-gray-400 text-center md:text-left">
         © 2023 SnowUI
      </div>
    </div>
  );
};
