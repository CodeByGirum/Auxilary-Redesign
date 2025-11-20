import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { TopBar } from './components/TopBar';
import { SettingsModal } from './components/SettingsModal';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import { NewChat } from './pages/NewChat';
import { SearchPage } from './pages/SearchPage';
import { Projects } from './pages/Projects';
import { Datasets } from './pages/Datasets';
import { Notebooks } from './pages/Notebooks';
import { Integrations } from './pages/Integrations';
import { Published } from './pages/Published';

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar 
        isExpanded={sidebarExpanded} 
        toggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} 
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full transition-all duration-300">
        <TopBar 
          onNotificationClick={() => setRightPanelOpen(!rightPanelOpen)}
        />
        
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-full mx-auto w-full h-full">
            {children}
          </div>
        </main>

        {/* Trigger Zone for Right Panel */}
        <div 
          className="fixed right-0 top-16 bottom-0 w-4 z-40 cursor-default hidden lg:block"
          onMouseEnter={() => setRightPanelOpen(true)}
        />
      </div>
      
      {/* Right Panel */}
      <RightPanel isOpen={rightPanelOpen} onClose={() => setRightPanelOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<NewChat />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/notebooks" element={<Notebooks />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/published" element={<Published />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;