
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquarePlus, Folder, Database, 
  Book, Puzzle, Globe, ChevronLeft, ChevronRight,
  MoreHorizontal, ExternalLink, FileText, MessageSquare
} from 'lucide-react';

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  onOpenSettings: () => void;
}

// Custom Diamond Grid Logo (Small Cluster)
export const AuxLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="4" height="4" />
    <rect x="8" y="2" width="4" height="4" />
    <rect x="2" y="8" width="4" height="4" />
    <rect x="8" y="8" width="4" height="4" />
    <rect x="14" y="2" width="4" height="4" />
    <rect x="14" y="8" width="4" height="4" />
    <rect x="2" y="14" width="4" height="4" />
    <rect x="8" y="14" width="4" height="4" />
    <rect x="14" y="14" width="4" height="4" />
  </svg>
);

const NavItem = ({ 
  icon: Icon, 
  to, 
  active = false,
  label,
  isExpanded
}: any) => {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-4 h-10 transition-colors duration-200 group rounded-none
        ${active 
          ? 'bg-gray-200 dark:bg-[#2a2a2a] text-black dark:text-white' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#212121] hover:text-black dark:hover:text-white'
        }
        ${isExpanded ? 'px-6 w-full' : 'w-full justify-center px-0'}
      `}
    >
      <Icon size={18} strokeWidth={1.5} className="flex-shrink-0" />
      
      {isExpanded && (
        <span className="text-sm font-medium whitespace-nowrap">
          {label}
        </span>
      )}
      
      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="fixed left-14 z-50 hidden group-hover:block bg-gray-900 dark:bg-white text-white dark:text-black text-xs px-2 py-1 font-medium whitespace-nowrap shadow-sm">
          {label}
        </div>
      )}
    </Link>
  );
};

interface HistoryItemProps {
  label: string;
  icon?: any;
  isExternal?: boolean;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ label, icon: Icon, isExternal = false }) => (
  <div className="group flex items-center justify-between px-6 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#212121] hover:text-black dark:hover:text-white cursor-pointer transition-colors rounded-none">
    <div className="flex items-center gap-3 overflow-hidden">
      {Icon && <Icon size={14} strokeWidth={1.5} className="flex-shrink-0 opacity-70" />}
      <span className="truncate">{label}</span>
    </div>
    {isExternal ? (
      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity" />
    ) : (
      <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black dark:hover:text-white transition-opacity">
        <MoreHorizontal size={14} />
      </button>
    )}
  </div>
);

export const Sidebar = ({ isExpanded, toggleSidebar, onOpenSettings }: SidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const primaryNav = [
    { icon: MessageSquarePlus, label: 'New Chat', path: '/' },
    { icon: Folder, label: 'Projects', path: '/projects' },
    { icon: Database, label: 'Datasets', path: '/datasets' },
    { icon: Book, label: 'Notebooks', path: '/notebooks' },
    { icon: Puzzle, label: 'Integrations', path: '/integrations' },
    { icon: Globe, label: 'Published', path: '/published' },
  ];

  const recentNotebooks = [
    'Sentiment Analysis',
    'Data Analysis for Cost',
    'Customer Data Insights',
    'Quarterly Data Clean up'
  ];

  const recentChats = [
    'Sentiment Analysis',
    'Data Analysis for Cost',
    'Customer Data Insights',
    'Quarterly Data Clean up'
  ];

  return (
    <aside 
      className={`
        h-full bg-[#F9F9F9] dark:bg-[#171717] flex flex-col border-r border-gray-200 dark:border-[#333] z-50 flex-shrink-0 transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-[280px]' : 'w-[60px]'}
      `}
    >
      
      {/* Header */}
      <div className={`flex items-center h-16 mb-2 flex-shrink-0 ${isExpanded ? 'px-6 justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-3">
            <div className="text-black dark:text-white">
                <AuxLogo className="w-5 h-5" />
            </div>
        </div>
        
        {isExpanded ? (
             <button 
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
                <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
        ) : (
            <button 
                onClick={toggleSidebar}
                className="absolute top-5 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
                <ChevronRight size={18} strokeWidth={1.5} />
            </button>
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex flex-col gap-1 w-full flex-shrink-0">
        {primaryNav.map((item) => (
          <NavItem 
            key={item.path}
            icon={item.icon} 
            label={item.label} 
            to={item.path} 
            active={isActive(item.path)}
            isExpanded={isExpanded}
          />
        ))}
      </nav>

      {/* History Sections (Only visible when expanded) */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto no-scrollbar mt-8 pb-4">
            
            {/* Notebooks Section */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white px-6 mb-3 uppercase tracking-wide">
                    Notebooks
                </h3>
                <div className="flex flex-col">
                    <HistoryItem label="Published" icon={Globe} isExternal={true} />
                    {recentNotebooks.map((item, i) => (
                        <HistoryItem key={i} label={item} icon={FileText} />
                    ))}
                </div>
            </div>

            {/* Chats Section */}
            <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white px-6 mb-3 uppercase tracking-wide">
                    Chats
                </h3>
                <div className="flex flex-col">
                    {recentChats.map((item, i) => (
                        <HistoryItem key={i} label={item} icon={MessageSquare} />
                    ))}
                </div>
            </div>
        </div>
      )}

    </aside>
  );
};
