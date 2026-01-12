
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { TopBar } from './components/TopBar';
import { SettingsModal } from './components/SettingsModal';
import { ThemeProvider } from './context/ThemeContext';
import { Check, Info, X } from 'lucide-react';
import { Notebook } from './types';

// Pages
import { NewChat } from './pages/NewChat';
import { SearchPage } from './pages/SearchPage';
import { Projects } from './pages/Projects';
import { Datasets } from './pages/Datasets';
import { Notebooks } from './pages/Notebooks';
import { Integrations } from './pages/Integrations';
import { Published } from './pages/Published';
import { NotebookEditor } from './pages/NotebookEditor'; // New Import
import { TableData } from './types/chat';

// --- Toast Context for Prototyping ---
interface Toast { id: string; message: string; type: 'success' | 'info'; }
interface ToastContextType { showToast: (msg: string, type?: 'success' | 'info') => void; }
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within Provider");
  return context;
};

const INITIAL_CHATS = [
  { id: 'c1', title: 'React Component Gen' },
  { id: 'c2', title: 'Debug Python Script' },
  { id: 'c3', title: 'Email Drafts' },
  { id: 'c4', title: 'SQL Query Help' }
];

const Layout = ({ children, currentPath, sidebarProps }: any) => {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Hide top bar in Notebook Editor for custom header
  const showTopBar = currentPath !== '/' && !currentPath.startsWith('/notebooks/');

  return (
    <div className="flex h-screen bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 overflow-hidden">
      <Sidebar 
        isExpanded={sidebarExpanded} 
        toggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} 
        onOpenSettings={() => setSettingsOpen(true)}
        onNotificationClick={() => setRightPanelOpen(!rightPanelOpen)}
        currentPath={currentPath.startsWith('/notebooks/') ? '/notebooks' : currentPath}
        {...sidebarProps}
      />
      <div className="flex-1 flex flex-col min-w-0 relative h-full transition-all duration-300">
        {showTopBar && <TopBar currentPath={currentPath} />}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-full mx-auto w-full h-full">
            {children}
          </div>
        </main>
        <div 
          className="fixed right-0 top-16 bottom-0 w-4 z-40 cursor-default hidden lg:block"
          onMouseEnter={() => setRightPanelOpen(true)}
        />
      </div>
      <RightPanel isOpen={rightPanelOpen} onClose={() => setRightPanelOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

const App = () => {
  const [currentPath, setCurrentPath] = useState(() => window.location.hash.slice(1) || '/');
  const [chatHistory, setChatHistory] = useState(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [incomingDataset, setIncomingDataset] = useState<{name: string, data: TableData, source: string} | null>(null);
  const [activeNotebook, setActiveNotebook] = useState<Notebook | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleChatUpdate = (id: string, title: string) => {
    setChatHistory(prev => {
      const exists = prev.find(c => c.id === id);
      if (exists) return prev.map(c => c.id === id ? { ...c, title } : c);
      return [{ id, title }, ...prev];
    });
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setChatHistory(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
    showToast(`Chat renamed to "${newTitle}"`);
  };

  const handleDeleteChat = (id: string) => {
    setChatHistory(prev => prev.filter(c => c.id !== id));
    if (selectedChatId === id) setSelectedChatId(null);
    showToast(`Conversation deleted`, 'info');
  };

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    window.location.hash = '/';
  };

  const handleOpenDataset = (dataset: {name: string, data: TableData, source: string}) => {
    setIncomingDataset(dataset);
    window.location.hash = '/';
  };

  // Notebook Handler
  const handleOpenNotebook = (notebook: Notebook) => {
      setActiveNotebook(notebook);
      // Use a sub-route pattern for state
      window.location.hash = `/notebooks/${notebook.id}`;
  };

  const renderPage = () => {
    if (currentPath.startsWith('/notebooks/') && activeNotebook) {
        return <NotebookEditor notebook={activeNotebook} onBack={() => window.location.hash = '/notebooks'} />;
    }

    switch (currentPath) {
      case '/': return <NewChat onChatUpdate={handleChatUpdate} selectedChatId={selectedChatId} incomingDataset={incomingDataset} onClearIncomingDataset={() => setIncomingDataset(null)} />;
      case '/search': return <SearchPage />;
      case '/projects': return <Projects />;
      case '/datasets': return <Datasets onOpenDataset={handleOpenDataset} />;
      case '/notebooks': return <Notebooks onOpenNotebook={handleOpenNotebook} />;
      case '/integrations': return <Integrations />;
      case '/published': return <Published />;
      default: return <NewChat onChatUpdate={handleChatUpdate} selectedChatId={selectedChatId} incomingDataset={incomingDataset} onClearIncomingDataset={() => setIncomingDataset(null)} />;
    }
  };

  return (
    <ThemeProvider>
      <ToastContext.Provider value={{ showToast }}>
        <Layout 
          currentPath={currentPath}
          sidebarProps={{
            chatHistory,
            onRenameChat: handleRenameChat,
            onDeleteChat: handleDeleteChat,
            onReorderChats: (newOrder: any) => setChatHistory(newOrder),
            onSelectChat: handleSelectChat
          }}
        >
          {renderPage()}
        </Layout>

        {/* Global Toast Container */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none">
          {toasts.map(t => (
            <div key={t.id} className="flex items-center gap-3 px-5 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-2xl animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto border border-white/10">
               {t.type === 'success' ? <Check size={16} className="text-green-400" /> : <Info size={16} className="text-blue-400" />}
               <span className="text-sm font-semibold whitespace-nowrap">{t.message}</span>
               <button onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                 <X size={14} />
               </button>
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </ThemeProvider>
  );
};

export default App;
